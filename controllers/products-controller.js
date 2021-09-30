const Product = require('../model/productModel')

//renders products by category or renders products category page
module.exports.render_products = async(req, res) => {
    const { category } = req.query
    if (category) {
        const products = await Product.find({ category })
        res.render('customer/poroducts-by-category', { products, what: category })
    } else {
        res.render('customer/products-page', { what: "Products" })
    }
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