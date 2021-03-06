const Product = require('../model/productModel')
const Order = require('../model/ordersModel')
const User = require('../model/userModel')
const Review = require('../model/reviews')
const { cloudinary } = require('../cl_config')


//dashboard route
module.exports.render_admin_dashboard = async(req, res) => {
    const newOrders = await Order.find({ order_status: "New" })
    const cancelledOrders = await Order.find({ order_status: "Cancelled" })
    const reviews = await Review.find()
    const newOrdersCount = newOrders.length
    const cancelledOrdersCount = cancelledOrders.length
    const reviewsCount = reviews.length

    res.render('admin/admin-dash', { what: 'Admin Dashboard', newOrdersCount, cancelledOrdersCount, reviewsCount })
}

//product route controllers
module.exports.render_products = async(req, res) => {
    const { category, tags } = (req.query)
    let title;
    if (tags) {
        const productsOnSale = await Product.find({ tags: { $all: ['OnSale'] } })
        title = `Products: ${tags}`
        return res.render('admin/products', { products: productsOnSale, what: title })
    }
    if (category) {
        const productsByCategory = await Product.find({ category })
        title = `Products: ${category}`
        return res.render('admin/products', { products: productsByCategory, what: title })
    } else {
        const allproducts = await Product.find()
        title = `Products: all`
        return res.render('admin/products', { products: allproducts, what: title })
    }
}

module.exports.delete_product = async(req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    req.flash('success', 'Product has been deleted!')
    res.redirect('/admin/products')
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
    req.flash('success', `${updatedProduct.name} has been updated!`)
    res.redirect(`/admin/products`)
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


//order route controllers

module.exports.render_orders = async(req, res) => {
    const { order_status } = req.query
    let orders
    let orderPageTitle
    if (order_status) {
        orders = await Order.find({ order_status })
        orderPageTitle = `Orders: ${order_status}`
    } else {
        orders = await Order.find({})
        orderPageTitle = `Orders: All`
    }
    for (let index in orders) {
        await orders[index].populate('order_owner')
    }
    // req.flash('info', 'For better experience, use wide screen resolution!')
    res.render('admin/orders', { what: orderPageTitle, orders, orderPageTitle })
}

module.exports.update_order = async(req, res) => {
    const { order_id, order_status, payment_status } = req.body
    const order = await Order.findByIdAndUpdate(order_id, { order_status, payment_status })
    await order.save()
    req.flash('success', 'Order has been updated!')
    res.redirect('/admin/orders')
}

///user route controllers
module.exports.render_users = async(req, res) => {
    const users = await User.find()
    for (let user of users) {
        await user.populate('orders')
    }

    res.render('admin/users', { what: 'Manage users', users })
}

//reviews routes
module.exports.render_reviews = async(req, res) => {
    const reviews = await Review.find({}).populate('author').populate('rated_product')

    res.render('admin/reviews', { what: "Reviews", reviews })
}