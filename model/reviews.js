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
        min: 0,
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
})

module.exports = mongoose.model('Review', reviewsSchema)