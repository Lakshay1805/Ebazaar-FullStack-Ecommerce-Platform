require("dotenv").config()
const express = require("express")
const app = express()
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db.js")
const userRoutes = require("./routes/userRoutes.js")
const productRoutes = require("./routes/productRoutes.js")
const orderRoutes = require("./routes/orderRoutes.js")
const paymentRoutes = require("./routes/paymentRoutes.js")
const subscriptionRoutes = require("./routes/subscriptionRoute.js")
const analyticRoutes = require("./routes/analyticRoutes.js")
const errorHandler = require("./middleware/errorHandlerMiddleware.js")
const PORT = process.env.PORT || 8000

connectDB();
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}));

app.use("/user" , userRoutes)
app.use("/products" , productRoutes)
app.use("/orders" , orderRoutes)
app.use("/payment" , paymentRoutes)
app.use("/analytics" , analyticRoutes)
app.use("/subscription" , subscriptionRoutes)
app.get("/" , (req , res)=>{
    res.send("root page working");
})

app.use(errorHandler);

app.listen(PORT , ()=>{
    console.log(`App is listening on port ${PORT} `)
})