const express = require('express');
const router = express.Router();
const { isLoggedIn, validateProductData, isAdmin } = require('../middleware');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const admin_controller = require('../controllers/admin-controller')



const multer = require('multer')
const { productsStorage } = require('../cl_config');
const upload = multer({ storage: productsStorage })


//dashboard
router.route('/')
    .get(isLoggedIn, isAdmin, (req, res) => { res.redirect('/admin/dashboard') })

router.route('/dashboard')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_admin_dashboard))

//order routes
router.route('/orders')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_orders))
    .post(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.update_order));

//products routes
router.route('/products')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_products))

router.route('/products/add')
    .get(isLoggedIn, isAdmin, admin_controller.render_new_product_template_for_admin)
    .post(isLoggedIn, isAdmin, upload.array('product_images'), validateProductData, admin_controller.create_product)

router.route('/products/:id')
    .delete(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.delete_product))

router.route('/products/:id/edit')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_product_edit_page))
    .put(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.update_product))

router.route('/products/:id/edit/photos')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_product_photos_edit_page))
    .post(isLoggedIn, isAdmin, upload.array('product_images'), catchAsyncErrors(admin_controller.manage_product_photos))



///users routes

router.route('/users')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_users))

///Reviews
router.route('/reviews')
    .get(isLoggedIn, isAdmin, catchAsyncErrors(admin_controller.render_reviews))

module.exports = router