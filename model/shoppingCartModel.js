const mongoose = require('mongoose')
const { Schema } = mongoose

const shoppingCartSchema = new Schema({
    products: [{
        cart_item: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        item_quantity: {
            type: Number,
            required: true
        }
    }],
    cart_owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = mongoose.model('ShoppingCart', shoppingCartSchema)