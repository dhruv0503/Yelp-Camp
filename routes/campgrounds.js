const express = require('express');
const app = express();
const router = express.Router();
const wrapAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campController = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const { array } = require('joi');
const upload = multer({storage});

router.route('/')
    .get(wrapAsync(campController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground ,wrapAsync(campController.create));
    

router.get('/new', isLoggedIn, campController.new)

router.route('/:id')
    .get(wrapAsync(campController.show))
    .put(isLoggedIn,isAuthor, upload.array('image'), validateCampground, wrapAsync(campController.update))
    .delete(isLoggedIn,isAuthor, wrapAsync(campController.delete));

router.get('/:id/edit',isLoggedIn,  isAuthor, wrapAsync(campController.updateForm))

module.exports = router;