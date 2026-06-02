const Order = require("../models/order.js")
const sendEmail = require("../utils/sendEmail.js")
const User = require("../models/user.js")

module.exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
        if (!orders) {
            return res.status(400).json({ error: true, message: "No order yet." })
        } else {
            return res.json({ error: false, message: "Here is the list of all orders", orders })
        }
    } catch (err) {
        next(err)
    }
}

module.exports.createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;

        if (!items || items.length == 0 || !totalAmount || !address) {
            return res.status(400).json({
                error: true,
                message: "Invalid order data"
            })
        } else {

            const order = await Order.create({
                userId: req.user.id,
                items,
                totalAmount,
                address,
                paymentId
            })
            const populateOrder = await Order.findById(order._id).populate("items.productId");
            const orderedItems = populateOrder.items.map(
                item => `
                    <li> 
                    ${item.productId.name} x ${item.qty}
                    </li>
                `
            ).join("");

            const user = await User.findById(req.user.id);
            const message = `
                <h2>Order Confirmation</h2>
                <p>Hello ${user.name},</p>
                <p>Your order has been successfully placed! Order ID: <strong>${order._id}</strong></p>
                <p>Total Amount Paid: ₹${totalAmount.toFixed(2)}</p>
                <p>It will be shipped to: ${address.street}, ${address.city}</p>
                <p>Thank you for shopping with Ebazaar!</p>
            `;

            await sendEmail(
                user.email,
                "Order created.",
                message
            );

            const adminMessage = `
                <h2>New Order Received 🛒</h2>

                <p><strong>Customer:</strong> ${user.name}</p>

                <p><strong>Email:</strong> ${user.email}</p>

                <p><strong>Order ID:</strong> ${order._id}</p>

                <h3>Ordered Products:</h3>

                <ul>
                    ${orderedItems}
                </ul>

                <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>

                <p><strong>Shipping Address:</strong></p>

                <p>
                    ${address.street},
                    ${address.city}
                </p>
            `;

            await sendEmail(
                process.env.ADMIN_EMAIL,
                "New Order Received",
                adminMessage
            );

            return res.status(201).json({
                error: false,
                message: "Order created successfully",
                order
            })
        }

    } catch (err) {
        next(err)
    }
}

module.exports.getMyOrders = async (req, res, next) => {
    try {
        const id = req.user.id;
        const orders = await Order.find({ userId: id })
        if (!orders) {
            return res.status(400).json({ error: true, message: "You have not ordered anything yet." })
        } else {
            return res.json({ error: false, message: "Here is the list of all of your orders." , orders})
        }
    } catch (err) {
        next(err)
    }
}

module.exports.updateOrderStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {status} = req.body;
        const item = await Order.findById(id)
        if (!item) {
            return res.status(400).json({ error: true, message: "Order do not exist." })
        } else {
            item.status = status || item.status;
            await item.save()
            return res.status(201).json({ error: false, message: "Order Status updated successfully" }, item)
        }
    } catch (err) {
        next(err)
    }
}

module.exports.getRecentOrders = async(req,res,next)=>{
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

    if(!orders){
        return res.status(400).json({error:true , message :"No order exist.."})
    }else{
        return res.json({error:false , orders})
    }
}
module.exports.getTopSoldProducts = async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.productId",
          totalSold: {
            $sum: "$items.qty"
          }
        }
      },
      {
        $sort: {
          totalSold: -1
        }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      }
    ]);

    res.status(200).json({
      error: false,
      topProducts
    });
  } catch (err) {
    next(err);
  }
};