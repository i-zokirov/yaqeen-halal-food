const path = require('path')
const mongoose = require('mongoose')
const ejsEngineMate = require('ejs-mate')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override')
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash');
const app = express()

//routers
const productsRouter = require('./routes/productRoutes')
const userRouter = require('./routes/userRoutes')
const shoppingCartRouter = require('./routes/shoppingCartRoutes')



const PORT = process.env.PORT || 3000
const User = require('./model/userModel')

//mongoode connection to MongoDB
mongoose.connect('mongodb://localhost:27017/yaqeen-halal-food-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'connection error: '))
mongoose.connection.once('open', () => {
    console.log('Database connected')
})


//ejs template set up
app.engine('ejs', ejsEngineMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//directory for serving static files
app.use(express.static(path.join(__dirname, '/public')))

//express body parser
app.use(express.urlencoded({ extended: true }))

//express session
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//Flash configuration
app.use(flash())

//passport middleware and configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//storing on the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//local variables configuration 
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    res.locals.warning = req.flash('warning')
    next()
})

//overriding default methods with forms
app.use(methodOverride('_method'))

//routes
app.get('/', (req, res) => {
    res.redirect('/products')
})

app.use('/products/', productsRouter)
app.use('/user', userRouter)
app.use('/shopping-cart/', shoppingCartRouter)


app.get('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.get('/fakeuser')

//error handler
app.use((err, req, res, next) => {
    const { statuscode = 500, message } = err
    if (!err.message) err.message = "Something went wrong!"
    res.status(statuscode).render('layouts/error-template', { what: "Error", err })

})

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`)
})