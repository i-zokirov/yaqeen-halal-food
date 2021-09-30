const express = require('express');
const router = express.Router();
const Order = require('../model/ordersModel')
const Product = require('../model/productModel')
const { isLoggedIn, validateProductData, isAdmin } = require('../middleware');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const products_controller = require('../controllers/admin-products-controller')



const multer = require('multer')
const { productsStorage } = require('../cl_config')
const upload = multer({ storage: productsStorage })

//order routes
router.route('/orders')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(products_controller.render_orders))
    .post(isLoggedIn, isAdmin, catchAsyncErrors(products_controller.update_order));



//products routes

router.route('/products')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(products_controller.render_products))

router.route('/products/add')
    .get(products_controller.render_new_product_template_for_admin)
    .post(upload.array('product_images'), validateProductData, products_controller.create_product)

router.route('/products/:id')
    .delete(catchAsyncErrors(products_controller.delete_product))

router.route('/products/:id/edit')
    .get(catchAsyncErrors(products_controller.render_product_edit_page))
    .put(catchAsyncErrors(products_controller.update_product))

router.route('/:id/edit/photos')
    .get(catchAsyncErrors(products_controller.render_product_photos_edit_page))
    .post(upload.array('product_images'), catchAsyncErrors(products_controller.manage_product_photos))


module.exports = router