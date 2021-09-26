const Product = require('../model/productModel')
const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')

//external middleware functions
const { isLoggedIn, validateProductData } = require('../middleware');

const multer = require('multer')
const { productsStorage, cloudinary } = require('../cl_config')
const upload = multer({ storage: productsStorage })

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

router.get('/:id/edit', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('admin/product-edit-template', { product: product, what: `Edit ${product.name}` })
}))
router.get('/:id/edit/photos', catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('admin/manage-product-photos', { product, what: `Manage ${product.name} photos` })
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

router.post('/:id/edit/photos', upload.array('product_images'), catchAsyncErrors(async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)

    if (req.files.length) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        product.images.push(...imgs)
        await product.save()
        req.flash('success', 'Photo(s) have been uploaded!')

    } else if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(product)
        req.flash('success', 'Selected Photo(s) have been deleted!')
    } else {
        req.flash('info', 'No updates to make!')
    }

    res.redirect(`/products/${product._id}/edit/photos`)

}))


router.post('/add', upload.array('product_images'), validateProductData, async(req, res) => {
    try {

        let { name, category, price, tags, quantity, quantity_type, description } = req.body
        const product = await new Product({ name, category, price, tags, quantity, quantity_type, description })
        product.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        const registeredProduct = await product.save()
        console.log(registeredProduct)
        req.flash('success', 'Product has been created!')
        res.redirect(`/products/${registeredProduct._id}`)
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/products/add')
    }

});




module.exports = router