const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!',
        'string.isValidPasswordPattern': '{{#label}} must be a valid password!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        },
        isValidPasswordPattern: {
            validate(value, helpers) {
                if (value.match(/[a-z]/g) && value.match(
                        /[A-Z]/g) && value.match(
                        /[0-9]/g) && value.match(
                        /[^a-zA-Z\d]/g) && value.length >= 8) {
                    return value
                } else {
                    return helpers.error('string.isValidPasswordPattern', { value })
                }
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

module.exports.userSchema = Joi.object({
    first_name: Joi.string().alphanum().trim().min(2).max(30).escapeHTML(),
    last_name: Joi.string().alphanum().trim().min(2).max(30).escapeHTML(),
    username: Joi.string().alphanum().trim().min(2).max(30).escapeHTML().required(),
    email_address: Joi.string().trim().email().escapeHTML().required(),
    phone_number: Joi.string().trim().escapeHTML(),
    password: Joi.string().isValidPasswordPattern().required(),
    password_confirmation: Joi.ref('password'),
    address: Joi.object({
        St_address: Joi.string().alphanum().trim().min(3).max(60).escapeHTML(),
        St_address2: Joi.string().alphanum().trim().min(3).max(60).escapeHTML(),
        city: Joi.string().alphanum().trim().min(2).max(60).escapeHTML(),
        postal_code: Joi.string().alphanum().trim().min(3).max(10).escapeHTML(),
        voivodship: Joi.string().alphanum().trim().min(3).max(60).escapeHTML(),
    })
})