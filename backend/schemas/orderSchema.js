const Joi = require("joi")

module.exports.orderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string()
                    .required(),
                qty: Joi.number()
                    .integer()
                    .min(1)
                    .required(),
                price: Joi.number()
                    .positive()
                    .required()
            })
        )
        .min(1)
        .required(),

    totalAmount: Joi.number()
        .positive()
        .required(),

    address: Joi.object({
        fullName: Joi.string()
            .required(),
        street: Joi.string()
            .required(),
        city: Joi.string()
            .required(),
        postalCode: Joi.number()
            .required(),
        state: Joi.string()
            .required()
    }).required(),

    paymentId: Joi.string()
        .optional()
});