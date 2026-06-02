const rateLimit = require("express-rate-limit")

const authLimiter = rateLimit({
    windowMs : 15*60*1000,
    max : 10,
    message : {error : true , message : "Too many requests from this IP , wait for 15 minutes and try again."}
})

module.exports = {authLimiter}; 