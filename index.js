const path = require('path')
const mongoose = require('mongoose')
const ejsEngineMate = require('ejs-mate')
const express = require('express')
const app = express()

const router = require('./routes/routes')
const PORT = process.env.PORT || 3000

//express body parser
app.use(express.urlencoded({ extended: true }))

//directory for serving static files
app.use(express.static(path.join(__dirname, 'public')))

//ejs template set up
app.engine('ejs', ejsEngineMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//mongoode connection to MongoDB

mongoose.connect('mongodb://localhost:27017/yaqeen-halal-food-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


mongoose.connection.on('error', console.error.bind(console, 'connection error: '))
mongoose.connection.once('open', () => {
    console.log('Database connected')
})

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`)
})