const User = require("../models/user")
const Product = require("../models/product")
const Order = require("../models/order")

module.exports.getAdminStats = async (req, res, next) => {
    try {
        const totalOrders = await Order.countDocuments({})
        const totalUsers = await User.countDocuments({}) - 1;
        const totalProducts = await Product.countDocuments({})

        const orders = await Order.find({})

        if(orders){
            const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);
            return res.json({ totalUsers, totalOrders, totalProducts, totalRevenueData });
        }else{
            return res.status(400).json({error : true , message : "There is no order yet."})
        }
        
    } catch (err) {
        next(err)
    }
}