const { string } = require('joi')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_300')
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
    image: imageSchema,
    default_image: {
        type: String,
        default: 'https://res.cloudinary.com/yaqeen-halal-food-img-cloud/image/upload/w_300/v1632617094/avatar_fvqbk2.jpg',
        required: true
    },
    shopping_cart: {
        type: Schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    created_date: {
        type: Date,
        default: Date.now
    }

})

userAccountSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userAccountSchema)