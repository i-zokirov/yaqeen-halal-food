const { userSchema } = require('./joi-schema')
const ExpressError = require('./utils/expressError')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('warning', 'You must be signed in first!')
        return res.redirect('/user/login')
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