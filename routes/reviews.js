const express = require('express');
const app = express();
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/reviews')

router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;