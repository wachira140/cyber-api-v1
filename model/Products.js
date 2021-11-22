const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'Please provide product"s name'],
             maxlength: 50,
        },
        brand:{
            type:String,
            required:[true, 'Please provide brand'],
            maxlength: 50,
        },
        featured:Boolean,
        category:{
            type:String,
            required:[true, 'Please provide category'],
        },
        color:{
            type:String,
            maxlength:50,
            required:[true, 'Please provide color'],
        },
        image:{
            type:String,
            required:true,
        },
        image_id:{
            type:String,
            required:[true, 'Image_id is required']
        },
        price:{
            type:Number,
            required:[true, 'Must provide price']
        },
        desc:{
            type:String,
            required:[true, 'Please provide description'],
            maxlength:100,
        },
        inStore:{
            type:Number,
            default:1,
        },
        classification:{
            type:String,
            required:[true, 'Please classify the product'],
            maxlength:5,
        },
    },{timestamps:true},
)

module.exports = mongoose.model('Products', ProductSchema )