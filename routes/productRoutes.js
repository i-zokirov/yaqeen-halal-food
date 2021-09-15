const Product = require('../model/productModel')
const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    res.render('customer/products-page', { what: "Products" })
});
router.get('/fruits', async(req, res) => {
    const fruits = await Product.find({ category: "fruits" })
    res.render('customer/poroducts-by-category', { products: fruits, what: "Fruits" })
});

router.get('/vegetables', async(req, res) => {
    const vegetables = await Product.find({ category: "vegetables" })
    res.render('customer/poroducts-by-category', { products: vegetables, what: "Vegetables" })
});

router.get('/spices', async(req, res) => {
    const spices = await Product.find({ category: "spices" })
    res.render('customer/poroducts-by-category', { products: spices, what: "Spices" })
});

router.get('/meat', async(req, res) => {
    const meat = await Product.find({ category: "meat" })
    res.render('customer/poroducts-by-category', { products: meat, what: "Meat Products" })
});


router.get('/:id', async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('customer/single-product', { product: product, what: product.name })
});


module.exports = router