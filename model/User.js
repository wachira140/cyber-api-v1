const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide a name'],
        maxlength:50,
        minlength:3,
    },
    email:{
        type:String,
        required:[true, 'Please provide email'],
        validate: {
                validator : validator.isEmail,
                message : 'Please provide valid email'
        },
    },
    password:{
        type:String,
        required:[true, 'Please provide password'],
        minlength: 6,
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default: 'user'
    },
    passwordToken:{
        type:String
    },
    passwordTokenExpiration:{
        type:Date
    },
    verificationToken:String,
    isVerified:{
        type:Boolean,
        default:false,
    },
    verified:Date,
})

UserSchema.pre('save', async function (){
     if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)