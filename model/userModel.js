const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose

const addressSchema = new Schema({

})
const userAccountSchema = new Schema({
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email_address: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        St_address: {
            type: String,
            default: ""
        },
        St_address2: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        postal_code: {
            type: String,
            default: ""
        },
        voivodship: {
            type: String,
            default: ""
        }
    },
    phone_number: {
        type: String,
        default: ""
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

userAccountSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userAccountSchema)