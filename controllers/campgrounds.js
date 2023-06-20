const campground = require('../Models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapboxToken})

module.exports.index = async (req,res) =>{
    const camps = await campground.find();
    res.render('camping/indexx', {camps});
}
module.exports.new = (req,res) =>{
    res.render("camping/new");
}

module.exports.show = async (req,res) =>{
    const { id } = req.params;
    const camps = await campground.findById(id).populate({
        path : 'review',
        populate : {
            path : 'author'
        }
    }).populate('author');
    console.log(camps);
    if(!camps){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('camping/show', {camps});
}
module.exports.create = async (req,res, next) =>{ 
    const geoData = await geocoder.forwardGeocode({
        query : req.body.location,
        limit : 1
    }).send();
    const camps = new campground(req.body);
    camps.geometry = geoData.body.features[0].geometry;
    camps.image = req.files.map(f => ({url : f.path, filename : f.filename}));
    camps.author = req.user._id;
    await camps.save();
    req.flash('success', 'Successfully created a Campground')
    res.redirect(`/campgrounds/${camps._id}`)
}

module.exports.updateForm = async (req,res) =>{
    const { id } = req.params;
    const camps = await campground.findById(id);
    if(!camps){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds'); 
    }
    res.render('camping/edit', { camps });
}

module.exports.update = async (req,res) => {
    const { id } = req.params;
    console.log(req.body);
    const camps = await campground.findByIdAndUpdate( id, req.body);
    const imgs = req.files.map(f => ({url : f.path, filename : f.filename}));
    camps.image.push(...imgs);
    await camps.save();
    if(req.body.deleteImages){
        req.body.deleteImages.forEach(el => {
            cloudinary.uploader.destroy(el);
        });
        await camps.updateOne({$pull : {image : {filename : { $in : req.body.deleteImages } }}})
        console.log(camps);
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camps._id}`);
}

module.exports.delete = async(req,res) =>{
    const { id } = req.params;
    const camps = await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground');
    res.redirect('/campgrounds');
}