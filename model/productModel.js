const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["fruits", "vegetables", "meat", "spices"]
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    quantity_type: {
        type: String,
        required: true,
        enum: ['kg', 'piece']
    },
    image: {
        type: String
    },
    tags: {
        type: Array,
        default: ["Available"]
    },
    created_date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Product', productSchema)