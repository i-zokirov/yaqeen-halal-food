const mongoose = require('mongoose')
const { Schema } = mongoose

const ordersSchema = new Schema({
    products: [{
        product_name: {
            type: String,
            required: true
        },
        product_id: {
            type: String,
            required: true
        },
        product_price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        product_quantity_type: {
            type: String,
            required: true,
            enum: ['kg', 'piece']
        },
        product_category: {
            type: String,
            required: true,
            enum: ["fruits", "vegetables", "meat", "spices"]
        }

    }],
    order_owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    order_status: {
        type: String,
        required: true,
        default: 'New',
        enum: ["New", "Packed", "Delivered", "Received"]
    },
    total_price: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true,
        enum: ['Cash-on-delivery', 'Online', 'Card-on-delivery']
    },
    payment_status: {
        type: String,
        required: true,
        default: 'Not Paid',
        enum: ['Paid-in-cash', 'Paid-online', 'Paid-by-card', 'Not Paid']
    },
    created_date: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Order', ordersSchema)