const { userRegisterSchema, userLoginSchema } = require("../schemas/userSchema")
const { productSchema } = require("../schemas/productSchema")
const { orderSchema } = require("../schemas/orderSchema")


module.exports.validateUserRegister = async (req, res, next) => {
    const { error } = userRegisterSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",")
        return res.status(400).json({ error: true, message: errMsg })
    }
    next()
}
module.exports.validateUserLogin = async (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",")
        return res.status(400).json({ error: true, message: errMsg })
    }
    next()
}

module.exports.validateProduct = async (req, res, next) => {
    const { error } = productSchema.validate(req.body)
    console.log(req.body);
    console.log(req.file);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",")
        return res.status(400).json({ error: true, message: errMsg })
    }
    next()
}

module.exports.validateOrder = async (req, res, next) => {
    const { error } = orderSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",")
        return res.status(400).json({ error: true, message: errMsg })
    }
    next()
}