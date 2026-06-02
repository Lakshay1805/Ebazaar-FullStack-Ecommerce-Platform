const Joi = require("joi")

module.exports.userRegisterSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[A-Za-z ]+$/)
        .min(8)
        .max(40)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(20)
        .required(),

    role: Joi.string()
        .valid("user", "admin")
        .default('user'),

    refreshToken: Joi.string()
        .optional(),
        
    verified: Joi.boolean()
        .default(false)
})

module.exports.userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});