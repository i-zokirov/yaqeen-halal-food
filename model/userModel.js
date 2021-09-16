const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose

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
        type: String,
        default: ""
    },
    phone_number: {
        type: Number,
        default: "",
        min: 0
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