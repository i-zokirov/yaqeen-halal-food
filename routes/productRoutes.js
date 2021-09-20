const Product = require('../model/productModel')
const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')

//external middleware functions
const { isLoggedIn, validateProductData } = require('../middleware')


router.get('/', (req, res) => {
    res.render('customer/products-page', { what: "Products" })
});

router.get('/add', (req, res) => {
    res.render('admin/add-product', { what: "Add product" })
})

router.get('/fruits', catchAsyncErrors(async(req, res) => {
    const fruits = await Product.find({ category: "fruits" })
    res.render('customer/poroducts-by-category', { products: fruits, what: "Fruits" })
}));

router.get('/vegetables', catchAsyncErrors(async(req, res) => {
    const vegetables = await Product.find({ category: "vegetables" })
    res.render('customer/poroducts-by-category', { products: vegetables, what: "Vegetables" })
}));

router.get('/spices', catchAsyncErrors(async(req, res) => {
    const spices = await Product.find({ category: "spices" })
    res.render('customer/poroducts-by-category', { products: spices, what: "Spices" })
}));

router.get('/meat', catchAsyncErrors(async(req, res) => {
    const meat = await Product.find({ category: "meat" })
    res.render('customer/poroducts-by-category', { products: meat, what: "Meat Products" })
}));

router.get('/onsale', catchAsyncErrors(async(req, res) => {
    const productsOnSale = await Product.find({ tags: ['OnSale'] })
    res.render('customer/poroducts-by-category', { products: productsOnSale, what: "Products on Sale" })
}))


router.get('/:id', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('customer/single-product', { product: product, what: product.name })
}));

router.post('/add', validateProductData, async(req, res) => {
    try {
        const { name, category, price, tags, quantity, quantity_type, description } = req.body
        const product = await new Product({ name, category, price, tags, quantity, quantity_type, description })
        const registeredProduct = await product.save()
        console.log(registeredProduct)
        req.flash('success', 'Product has been saved')
        res.redirect(`/products/${registeredProduct._id}`)
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/products/add')
    }
});




module.exports = router