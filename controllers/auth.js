const User = require('../model/User')
const Token = require('../model/Token')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {createCookie} = require('../utils/jwt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const hashPasswordToken = require('../utils/hashPasswordToken')





const register = async(req, res)=>{
    const { email, name, password } = req.body
    const emailExists = await User.findOne({ email })
    if(emailExists){
       throw new CustomError.BadRequestError("Email already in use")
    }

    const adminAccount = await User.countDocuments({})=== 0
    const role = adminAccount ? 'admin' : 'user'

    const verificationToken = crypto.randomBytes(40).toString('hex')

   const user = await User.create({
       name,
       email,
        password, 
        role, 
        verificationToken})


const origin = 'https://www.nairobiaccessories.com'

await sendVerificationEmail({
    name:user.name,
    email:user.email,
     verificationToken:user.verificationToken,
     origin
    })

//    const payload = {name:user.name, userId:user._id, role:user.role}

//    createCookie({res, value:payload})

   res.status(StatusCodes.CREATED).json({msg:"Success, Please check your email to verify account"})
}


const  verifyEmail = async(req, res)=>{
const {verificationToken, email} = req.body

const user = await User.findOne({ email })

if(!user){
    throw new CustomError.NotFoundError(`No user with an email of : ${email}`)
}

if(user.verificationToken !== verificationToken){
    throw new CustomError.UnAuthorized(`verification token is invalid`)
}

user.isVerified = true;
user.verified = Date.now();
user.verificationToken = '';

await user.save()
 
res.status(StatusCodes.OK).json({msg:"email verified"})
}



const login =  async(req, res)=>{
    const { email, password } = req.body

    if( !email || !password){
        throw new CustomError.BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })

    if(!user){
        throw new CustomError.UnAuthorized('Invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnAuthorized('Invalid password')
    }

    if(!user.isVerified){
        throw new CustomError.UnAuthorized('Your email is not verified')
    }

     const payload = {name:user.name, userId:user._id, role:user.role}


    //  create refresh token

    let refreshToken = '';


    const existingToken = await Token.findOne({ user:user._id})

    if(existingToken){
        const { isValid } = existingToken
        if(!isValid){
             throw new CustomError.UnAuthorized('Not Authorized to login. Contact admin')
        }
        refreshToken= existingToken.refreshToken
         createCookie({res, user:payload, refreshToken})
         res.status(StatusCodes.OK).json({user:payload})
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex')
    // const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {refreshToken, ip,user:user._id}

    await Token.create(userToken)

   createCookie({res, user:payload, refreshToken})

   res.status(StatusCodes.CREATED).json({user:payload})

}


const logout = async (req, res)=>{

    await Token.findOneAndDelete({user:req.user.userId})
    
    res.cookie('accessToken', 'logout',{
        expires: new Date(Date.now()),
        httpOnly:true,
    })
    res.cookie('refreshToken', 'logout',{
        expires: new Date(Date.now()),
        httpOnly:true,
    })

    res.status(StatusCodes.OK).json({msg : 'you have successfully logged out!'})
}


const forgotPassword = async(req, res)=>{
    const { email } = req.body

    if(!email){
        throw new CustomError.BadRequestError("Please provide valid email")
    }
    const user = await User.findOne({ email })
    
    if(user){
        const origin = 'https://www.nairobiaccessories.com'
        const passwordToken = crypto.randomBytes(70).toString('hex')
        await sendResetPasswordEmail({ 
            name:user.name, 
            email:user.email,
            token:passwordToken, 
            origin
        })
        
        const minutes = 1000 * 60 * 10;
        const passwordTokenExpiration = new Date(Date.now() + minutes)
    
        user.passwordToken = hashPasswordToken(passwordToken)
        user.passwordTokenExpiration = passwordTokenExpiration
        await user.save();
    }

    res.status(StatusCodes.OK).json({ msg: 'Please check your email for a reset password link'})
}


const resetPassword = async(req, res)=>{
    const { token, email, password } = req.body
     if(!token || !email || !password){
       throw new CustomError.BadRequestError("All values required!!")
    }

    const user = await User.findOne({ email })
    if(user){
        const currentDate = new Date()

        const hash = hashPasswordToken(token)

        
        if(user.passwordToken === hashPasswordToken(token) && user.passwordTokenExpiration > currentDate){
            user.password = password
               user.passwordToken = null
               user.passwordTokenExpiration = null

               await user.save();
         }
    }

    res.status(StatusCodes.OK).json({ msg: 'Password reset successfully'})
}

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
}