const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const router = require('./routes/routes')
const PORT = process.env.PORT || 3000

//express body parser
app.use(express.urlencoded({ extended: true }))

//directory for serving static files
app.use(express.static(path.join(__dirname, 'public')))

//ejs template set up
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`)
})