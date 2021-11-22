const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true,
    },
    name:{
        type:String,
        required:true,
    },
    order:{
        type:mongoose.Schema.ObjectId,
        ref:'Orders',
        require:true,
    },
    checkoutrequestId:{
        type:String,
        required:true,
    },
    merchantRequestId:{
         type:String,
        required:true,
    },
    mpesaReceipt:{
        type:String,
        default:'defaultReceipt',
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
     status:{
        type:String,
        enum:['pending','completed','failed'],
        default:'pending'
    },
    amount:{
        type:Number,
        required:true,
    }

},{timestamps:true})

module.exports = mongoose.model('Payment', PaymentSchema)