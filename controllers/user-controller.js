const User = require('../model/userModel')
const ShoppingCart = require('../model/shoppingCartModel')
const { cloudinary } = require('../cl_config')

module.exports.render_myaccount_page = (req, res) => {
    res.render('customer/user-account', { what: "MyAccount" })
};

module.exports.render_myaccount_edit_page = (req, res) => {
    res.render('customer/complete-user-profile-form', { what: "Edit MyAccount" })
};

module.exports.update_user_data = async(req, res) => {
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
};

module.exports.destroy_user_account = async(req, res) => {
    const { _id, shopping_cart, image } = await req.user.populate('shopping_cart')
    if (shopping_cart) await ShoppingCart.findByIdAndDelete(shopping_cart._id)
    if (image) await cloudinary.uploader.destroy(image.filename)
    await User.findByIdAndDelete(_id)
    req.flash('success', 'Your account has been deleted!')
    res.redirect('/')
};

module.exports.render_user_purchases = async(req, res) => {
    const { id } = req.user
    const { orders } = await User.findById(id).populate('orders')
    res.render('customer/user-purchases', { what: "My Purchases", orders })
};

module.exports.render_user_registration_form = (req, res) => {
    res.render('customer/user-register', { what: "Sign Up" })
};

module.exports.register_user = async(req, res) => {
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
};

module.exports.render_user_login_form = (req, res) => {
    res.render('customer/user-login', { what: "Sign In" })
};

module.exports.log_user_in = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || req.user.isAdmin ? '/admin/dashboard' : '/products'
    delete req.session.returnTo
    res.redirect(redirectURL)
};

module.exports.log_out_user = (req, res) => {
    req.logout()
    req.flash('success', 'Signed out!')
    res.redirect('/')
};

module.exports.update_user_profile_photo = async(req, res) => {
    const { _id } = req.user
    const { filename, path } = req.file
    if (req.user.image) {
        await cloudinary.uploader.destroy(req.user.image.filename)
    }
    const user = await User.findByIdAndUpdate(_id, { image: { url: path, filename } })
    await user.save()
    req.flash('success', 'Your photo has been uploaded!')
    res.redirect('/user/myaccount')
}