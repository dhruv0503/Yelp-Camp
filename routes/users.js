const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/catchAsync');
const passport = require('passport');
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.registerForm)
    .post(wrapAsync(userController.register));

router.route('/login')
    .get(userController.loginForm)
    .post(passport.authenticate('local', { failureRedirect : '/login', failureFlash : true, keepSessionInfo:true}), userController.login)

router.get('/logout', userController.logout)

module.exports = router;