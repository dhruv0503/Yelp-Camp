const expressError = require('./utils/expressError')
const {campgroundSchema, reviewSchema} = require('./schemas');
const campground = require('./Models/campground');
const review = require('./Models/review');

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isAuthor =  async (req, res, next) =>{
    const { id } = req.params;
    const camp = await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'You cannot do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor =  async (req, res, next) =>{
    const {id, reviewId } = req.params;
    const reviews = await review.findById(reviewId);
    if(!reviews.author.equals(req.user._id)){
        req.flash('error', 'You cannot do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}