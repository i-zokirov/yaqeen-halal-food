const User = require('../model/userModel')
const ShoppingCart = require('../model/shoppingCartModel')
const express = require('express');
const router = express.Router()
const passport = require('passport')
const catchAsyncErrors = require('../utils/catchAsyncErrors')

//external middleware functions
const { isLoggedIn, validateUserData } = require('../middleware')


router.get('/myaccount', isLoggedIn, (req, res) => {
    res.render('customer/user-account', { what: "MyAccount" })
});
router.get('/myaccount/edit', isLoggedIn, (req, res) => {
    res.render('customer/complete-user-profile-form', { what: "MyAccount" })
});

router.get('/register', (req, res) => {
    res.render('customer/user-register', { what: "Sign Up" })
});

router.get('/login', (req, res) => {
    res.render('customer/user-login', { what: "Sign In" })
});

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Signed out!')
    res.redirect('/')
});

router.post('/register', validateUserData, async(req, res) => {
    try {
        const { email_address, username, password } = req.body
        const newUser = new User({ email_address, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            console.log("New user registered", registeredUser)
            req.flash('success', 'Welcome to Yaqeen-Halal-Food!')
            res.redirect('/user/myaccount')
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/user/register')
    }
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/user/myaccount';
    delete req.session.returnTo
    res.redirect(redirectURL)
});

router.post('/myaccount/edit', isLoggedIn, async(req, res) => {
    try {
        const { id } = req.user
        const user = await User.findByIdAndUpdate(id, {...req.body })
        await user.save()
        req.flash('success', 'Updated profile data!')
        res.redirect('/user/myaccount')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/user/myaccount/edit')
    }

});

router.delete('/myaccount', isLoggedIn, catchAsyncErrors(async(req, res) => {
    const { _id, shopping_cart } = await req.user.populate('shopping_cart')
    if (shopping_cart) await ShoppingCart.findByIdAndDelete(shopping_cart._id)
    await User.findByIdAndDelete(_id)
    req.flash('success', 'Your account has been deleted!')
    res.redirect('/')
}))

module.exports = router