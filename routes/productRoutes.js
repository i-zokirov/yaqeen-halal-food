const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const products_controller = require('../controllers/products-controller')

router.route('/')
    .get(products_controller.render_products)

router.route('/onsale')
    .get(catchAsyncErrors(products_controller.render_products_onsale))

router.route('/:id')
    .get(catchAsyncErrors(products_controller.render_single_product))

module.exports = router