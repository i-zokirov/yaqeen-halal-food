const Product = require('../model/productModel')
const ShoppingCart = require('../model/shoppingCartModel')
const User = require('../model/userModel')
const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')

//external middleware functions
const { isLoggedIn, validateProductData } = require('../middleware');



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

router.get('/shopping-cart', isLoggedIn, catchAsyncErrors(async(req, res) => {
    const { id } = req.user
    const user = await User.findById(id).populate('shopping_cart')
    if (user.shopping_cart) {
        const shopping_cart = await (await ShoppingCart.findById(user.shopping_cart._id)).populate('cart_owner')

        for (let index in shopping_cart.products) {
            await shopping_cart.populate(`products.${index}.cart_item`)
        }
        console.log(shopping_cart)
        res.render('customer/shoppingcart-template', { what: "MyCart", shopping_cart })
    } else {
        req.flash('info', 'You do not have any items in your cart. Add products to your cart to view them.')
        res.redirect('/products')
    }
}));


router.post('/shopping-cart/add', isLoggedIn, catchAsyncErrors(async(req, res) => {
    const { productID, userID, quantity } = req.body
    const user = await User.findById(userID)
    const product = await Product.findById(productID)
    if (user.shopping_cart) {
        await user.populate('shopping_cart')
        const existing_cart = await ShoppingCart.findById(user.shopping_cart._id)
        existing_cart.products.push({ cart_item: product, item_quantity: quantity })
        await existing_cart.save()
    } else {
        const new_shopping_cart = await new ShoppingCart({ products: [{ cart_item: productID, item_quantity: quantity }] })
        new_shopping_cart.cart_owner = userID
        await new_shopping_cart.save()
        user.shopping_cart = new_shopping_cart._id
        await user.save()
    }

    req.flash('success', `${product.name} has been added to your shopping cart!`)
    res.redirect('/products/shopping-cart')
}))

router.delete('/shopping-cart', (req, res) => {

})

router.get('/:id', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('customer/single-product', { product: product, what: product.name })
}));

router.get('/:id/edit', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('admin/product-edit-template', { product: product, what: `Edit ${product.name}` })
}))

router.delete('/:id', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    req.flash('success', 'Product has been deleted!')
    res.redirect('/products')
}))

router.put('/:id/edit', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, {...req.body })
    const updatedProduct = await product.save()
    req.flash('success', 'Product has been updated!')
    res.redirect(`/products/${updatedProduct._id}`)
}));

router.post('/add', validateProductData, async(req, res) => {
    try {
        const { name, category, price, tags, quantity, quantity_type, description } = req.body
        const product = await new Product({ name, category, price, tags, quantity, quantity_type, description })
        const registeredProduct = await product.save()
        console.log(registeredProduct)
        req.flash('success', 'Product has been saved!')
        res.redirect(`/products/${registeredProduct._id}`)
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/products/add')
    }
});




module.exports = router