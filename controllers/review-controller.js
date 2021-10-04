const Product = require('../model/productModel')
const User = require('../model/userModel')
const Review = require('../model/reviews')

module.exports.create_review = async(req, res) => {
    const { productID } = req.params
    const userID = req.user._id
    const { rating, body } = req.body.review
    const product = await Product.findById(productID)
    const review = new Review({ rating, body, author: userID, rated_product: productID })
    await review.save()
    product.reviews.push(review)
    await product.save()
    req.flash('success', 'Review has been submitted')
    res.redirect(`/products/${productID}`)
}

module.exports.delete_review = async(req, res) => {
    const { productID, reviewID } = req.params
    await Product.findByIdAndUpdate(productID, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Review has been deleted')
    res.redirect(`/products/${productID}`)
}