const Joi = require("joi")

module.exports.productSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required(),

    description: Joi.string()
        .min(5)
        .required(),

    price: Joi.number()
        .positive()
        .required(),

    category: Joi.string()
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .required(),

    ratings: Joi.number()
        .min(0)
        .max(5)
        .default(0),

    numReviews: Joi.number()
        .min(0)
        .default(0)
});