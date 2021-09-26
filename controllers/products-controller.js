const Product = require('../model/productModel')
const { cloudinary } = require('../cl_config')

module.exports.render_products_page = (req, res) => {
    res.render('customer/products-page', { what: "Products" })
}

module.exports.render_fruits = async(req, res) => {
    const fruits = await Product.find({ category: "fruits" })
    res.render('customer/poroducts-by-category', { products: fruits, what: "Fruits" })
}

module.exports.render_vegetables = async(req, res) => {
    const vegetables = await Product.find({ category: "vegetables" })
    res.render('customer/poroducts-by-category', { products: vegetables, what: "Vegetables" })
}

module.exports.render_spices = async(req, res) => {
    const spices = await Product.find({ category: "spices" })
    res.render('customer/poroducts-by-category', { products: spices, what: "Spices" })
}

module.exports.render_meat = async(req, res) => {
    const meat = await Product.find({ category: "meat" })
    res.render('customer/poroducts-by-category', { products: meat, what: "Meat Products" })
}

//this controller needs refactoring
module.exports.render_products_onsale = async(req, res) => {
    const productsOnSale = await Product.find({ tags: ['OnSale'] })
    res.render('customer/poroducts-by-category', { products: productsOnSale, what: "Products on Sale" })
}

module.exports.render_single_product = async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('customer/single-product', { product: product, what: product.name })
}

module.exports.delete_product = async(req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    req.flash('success', 'Product has been deleted!')
    res.redirect('/products')
}

module.exports.render_product_edit_page = async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('admin/product-edit-template', { product: product, what: `Edit ${product.name}` })
}

module.exports.update_product = async(req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, {...req.body })
    const updatedProduct = await product.save()
    req.flash('success', 'Product has been updated!')
    res.redirect(`/products/${updatedProduct._id}`)
}

module.exports.render_product_photos_edit_page = async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('admin/manage-product-photos', { product, what: `Manage ${product.name} photos` })
}

module.exports.manage_product_photos = async(req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (req.files.length) {
        //if new images are submitted, update product records
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        product.images.push(...imgs)
        await product.save()
        req.flash('success', 'Photo(s) have been uploaded!')
    } else if (req.body.deleteImages) {
        //if images to be deleted, delete
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
}

module.exports.render_new_product_template_for_admin = (req, res) => {
    res.render('admin/add-product', { what: "Add product" })
}

module.exports.create_product = async(req, res) => {
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
}