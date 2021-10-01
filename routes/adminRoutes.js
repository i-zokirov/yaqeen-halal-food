const express = require('express');
const router = express.Router();
const Order = require('../model/ordersModel')
const Product = require('../model/productModel')
const { isLoggedIn, validateProductData, isAdmin } = require('../middleware');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const admin_controller = require('../controllers/admin-controller')



const multer = require('multer')
const { productsStorage } = require('../cl_config')
const upload = multer({ storage: productsStorage })

//order routes
router.route('/orders')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_orders))
    .post(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.update_order));



//products routes

router.route('/products')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_products))

router.route('/products/add')
    .get(admin_controller.render_new_product_template_for_admin)
    .post(upload.array('product_images'), validateProductData, admin_controller.create_product)

router.route('/products/:id')
    .delete(catchAsyncErrors(admin_controller.delete_product))

router.route('/products/:id/edit')
    .get(catchAsyncErrors(admin_controller.render_product_edit_page))
    .put(catchAsyncErrors(admin_controller.update_product))

router.route('/:id/edit/photos')
    .get(catchAsyncErrors(admin_controller.render_product_photos_edit_page))
    .post(upload.array('product_images'), catchAsyncErrors(admin_controller.manage_product_photos))



///users routes

router.route('/users')
    .get(catchAsyncErrors(admin_controller.render_users))

module.exports = router