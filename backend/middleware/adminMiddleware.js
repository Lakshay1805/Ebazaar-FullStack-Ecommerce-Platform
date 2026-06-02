const User = require("../models/user.js")
require("dotenv").config()

const admin = async(req , res , next)=>{

    const user = await User.findById(req.user.id)
    if(user && user.role  == 'admin' && user.email == process.env.ADMIN_EMAIL){
        next();
    }else{
        res.status(403).json({message : "Access denied, admin only."})
    }
}
module.exports = {admin} ; 