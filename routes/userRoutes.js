const express = require('express');
const router = express.Router()
const passport = require('passport')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const user_controller = require('../controllers/user-controller')

//external middleware functions
const { isLoggedIn, validateUserData } = require('../middleware')

//cloudinary/multer set up
const multer = require('multer')
const { usersStorage } = require('../cl_config')
const upload = multer({ storage: usersStorage })

router.route('/myaccount')
    .get(isLoggedIn, user_controller.render_myaccount_page)
    .delete(isLoggedIn, catchAsyncErrors(user_controller.destroy_user_account))

router.route('/myaccount/edit')
    .get(isLoggedIn, user_controller.render_myaccount_edit_page)
    .post(isLoggedIn, user_controller.update_user_data)


router.route('/myaccount/purchases')
    .get(isLoggedIn, catchAsyncErrors(user_controller.render_user_purchases))

router.route('/register')
    .get(user_controller.render_user_registration_form)
    .post(validateUserData, user_controller.register_user)

router.route('/login')
    .get(user_controller.render_user_login_form)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), user_controller.log_user_in)

router.route('/logout')
    .get(user_controller.log_out_user)

router.route('/myaccount/profile-photo')
    .post(upload.single('user_image'), isLoggedIn, catchAsyncErrors(user_controller.update_user_profile_photo))

module.exports = router