const express = require('express');
const router = express.Router();
const Order = require('../model/ordersModel')

const { isLoggedIn, validateProductData, isAdmin } = require('../middleware');
const catchAsyncErrors = require('../utils/catchAsyncErrors');


router.get('/orders', isLoggedIn, isAdmin, catchAsyncErrors(async(req, res) => {
    const orders = await Order.find({})
    for (let index in orders) {
        await orders[index].populate('order_owner')
    }

    res.render('admin/orders', { what: "Admin: Orders", orders })
}));

router.post('/orders', isLoggedIn, isAdmin, catchAsyncErrors(async(req, res) => {
    console.log(req.body)
    const { order_id, order_status, payment_status } = req.body
    const order = await Order.findByIdAndUpdate(order_id, { order_status, payment_status })
    console.log(order, order_id)
    await order.save()
    req.flash('success', 'Order has been updated!')
    res.redirect('/admin/orders')
}))

module.exports = router