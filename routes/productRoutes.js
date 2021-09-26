const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const products_controller = require('../controllers/products-controller')

//external middleware functions
const { isLoggedIn, validateProductData } = require('../middleware');

const multer = require('multer')
const { productsStorage } = require('../cl_config')
const upload = multer({ storage: productsStorage })

router.route('/')
    .get(products_controller.render_products_page)

router.route('/add')
    .get(products_controller.render_new_product_template_for_admin)
    .post(upload.array('product_images'), validateProductData, products_controller.create_product)

router.route('/fruits')
    .get(catchAsyncErrors(products_controller.render_fruits))

router.route('/vegetables')
    .get(catchAsyncErrors(products_controller.render_vegetables))

router.route('/spices')
    .get(catchAsyncErrors(products_controller.render_spices))

router.route('/meat')
    .get(catchAsyncErrors(products_controller.render_meat))

router.route('/onsale')
    .get(catchAsyncErrors(products_controller.render_products_onsale))

router.route('/:id')
    .get(catchAsyncErrors(products_controller.render_single_product))
    .delete(catchAsyncErrors(products_controller.delete_product))

router.route('/:id/edit')
    .get(catchAsyncErrors(products_controller.render_product_edit_page))
    .put(catchAsyncErrors(products_controller.update_product))

router.route('/:id/edit/photos')
    .get(catchAsyncErrors(products_controller.render_product_photos_edit_page))
    .post(upload.array('product_images'), catchAsyncErrors(products_controller.manage_product_photos))

module.exports = router