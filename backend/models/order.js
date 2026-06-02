const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const orderSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    items : [
        {productId :{type:Schema.Types.ObjectId , ref : 'Product' , required : true},
        qty : {type : Number , required : true},
        price : {type : Number , required : true}}
    ],
    totalAmount : {type : Number , required:true},
    address : {
        fullName : {type : String , required : true},
        street : {type : String , required : true},
        city : {type : String , required : true},
        postalCode : {type : Number , required : true},
        state : {type : String , required : true}
    },
    paymentId : {type : String},
    status : {type : String , enum : ['Pending' , 'Shipped' , 'Delivered'] , default : 'Pending'}
} , {timestamps : true})

module.exports = mongoose.model("Order" , orderSchema);