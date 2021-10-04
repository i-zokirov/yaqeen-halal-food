const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const products_controller = require('../controllers/products-controller')
const review_controller = require('../controllers/review-controller')

const { isLoggedIn } = require('../middleware');
router.route('/')
    .get(products_controller.render_products)

router.route('/onsale')
    .get(catchAsyncErrors(products_controller.render_products_onsale))

router.route('/:id')
    .get(catchAsyncErrors(products_controller.render_single_product))

router.route('/:productID/reviews')
    .post(isLoggedIn, catchAsyncErrors(review_controller.create_review))

router.route('/:productID/reviews/:reviewID')
    .delete(isLoggedIn, catchAsyncErrors(review_controller.delete_review))

module.exports = router