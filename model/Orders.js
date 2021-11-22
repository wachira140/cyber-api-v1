const mongoose = require('mongoose')


const SingleItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
})

const OrderSchema = new mongoose.Schema({
   total:{
        type:Number,
        required:true,
   },
   transport:{
        type:Number,
        required:true,
   },

    subtotal:{
        type:Number,
        required: true,
    },
    location:{
        type:String,
        required: true,
    },
    courier:{
        type:String,
        required: true,
    },
    pick_up:{
        type:String,
        required: true,
    },
    contact:{
        type:Number,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required: true,
    },
    status:{
        type:String,
        enum:['pending', 'failed', 'paid','delivered', 'cancelled'],
        default:'pending'
    },
    orderItems: [SingleItemSchema],

},{timestamps:true})

module.exports = mongoose.model('Order', OrderSchema)