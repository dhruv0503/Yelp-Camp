const review = require('../Models/review');
const campground = require('../Models/campground');

module.exports.createReview = async (req, res) =>{
    const {id} = req.params;
    const camp = await campground.findById(id)
    const rev = new review(req.body)
    rev.author = req.user._id;
    camp.review.push(rev);
    await rev.save();
    await camp.save();
    req.flash('success', 'Created New Review');
    console.log(id);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req,res) => {
    const {id, reviewId} = req.params;
    await campground.findByIdAndUpdate(id, { $pull : {review : reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}