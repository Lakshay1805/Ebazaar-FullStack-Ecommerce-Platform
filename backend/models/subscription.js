const { required } = require("joi");
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

module.exports = mongoose.model("Subscribe" , subscriptionSchema);