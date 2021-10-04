const mongoose = require('mongoose')
const { Schema } = mongoose


const reviewsSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rated_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    created_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Review', reviewsSchema)