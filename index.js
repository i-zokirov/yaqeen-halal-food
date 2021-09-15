const path = require('path')
const mongoose = require('mongoose')
const ejsEngineMate = require('ejs-mate')
const express = require('express')
const app = express()

const productsRouter = require('./routes/productRoutes')
const PORT = process.env.PORT || 3000

const Product = require('./model/productModel')


//ejs template set up
app.engine('ejs', ejsEngineMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//directory for serving static files
app.use(express.static(path.join(__dirname, '/public')))

//express body parser
app.use(express.urlencoded({ extended: true }))

//mongoode connection to MongoDB

mongoose.connect('mongodb://localhost:27017/yaqeen-halal-food-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


mongoose.connection.on('error', console.error.bind(console, 'connection error: '))
mongoose.connection.once('open', () => {
    console.log('Database connected')
})

app.get('/', (req, res) => {
    res.redirect('/products')
})
app.get('/myaccount', (req, res) => {
    res.render('customer/user-account', { what: "MyAccount" })
})

app.use('/products', productsRouter)

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`)
})