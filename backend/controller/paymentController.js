const crypto = require("crypto")
const instance = require("../utils/razorpayInstance")

module.exports.createOrder = async (req, res, next) => {
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
        }
        const order = await instance.orders.create(options);
        return res.status(201).json({ error: false, order })
    } catch (err) {
        return res.status(400).json({ error: true, message: "Server error" })
    }
}

module.exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZOR_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};