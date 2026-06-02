const Subscribe = require("../models/subscription");
const sendEmail = require("../utils/sendEmail");

module.exports.subscribe = async (req, res , next) => {
  try {
    const { email } = req.body;

    const existing = await Subscribe.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    await Subscribe.create({ email });
    await sendEmail(
      email,
      "Welcome to E-Commerce Store",
      `
      <h2>Thanks for subscribing!</h2>
      <p>We'll notify you when premium membership launches.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (err) {
    next(err);
  }
};