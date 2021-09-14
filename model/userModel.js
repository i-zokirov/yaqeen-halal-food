const mongoose = require('mongoose')
const { Schema } = mongoose

const userAccountSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
        min: 0
    },
    email_address: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('User', userAccountSchema)