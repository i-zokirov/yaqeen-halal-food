const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const shooping_cart_controller = require('../controllers/shopping-cart-controller')

//external middleware functions
const { isLoggedIn } = require('../middleware');

router.route('/')
    .get(isLoggedIn, catchAsyncErrors(shooping_cart_controller.render_shopping_cart))


router.route('/add')
    .post(isLoggedIn, catchAsyncErrors(shooping_cart_controller.add_item))


router.route('/delete=:cartItemId')
    .delete(isLoggedIn, catchAsyncErrors(shooping_cart_controller.remove_item));


router.route('/update=:cartItemId')
    .put(isLoggedIn, catchAsyncErrors(shooping_cart_controller.update_quantity))


router.route('/checkout=:cartID')
    .post(isLoggedIn, catchAsyncErrors(shooping_cart_controller.process_order))

module.exports = router