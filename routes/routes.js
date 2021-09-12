const Product = require('../model/productModel')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('index')
});

router.get('/fruits', async(req, res) => {
    const fruits = await Product.find({ category: "fruits" })
    res.render('poroductsByCategory', { fruits })
})

module.exports = router