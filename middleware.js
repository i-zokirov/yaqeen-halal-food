const { userSchema, productSchema } = require('./joi-schema')
const ExpressError = require('./utils/expressError')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.originalUrl == '/shopping-cart/add') {
            req.originalUrl = '/products'
        }
        req.session.returnTo = req.originalUrl
        req.flash('warning', 'You must be signed in first!')
        return res.redirect('/user/login')
    }
    next()
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.session.returnTo = req.originalUrl
        req.flash('warning', 'You must be admin to do that!')
        return res.redirect('/products')
    }
    next()
}

module.exports.validateUserData = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
module.exports.validateProductData = (req, res, next) => {

    const { error } = productSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}