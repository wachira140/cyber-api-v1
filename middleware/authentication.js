
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { isTokenValid } = require('../utils/jwt')
const Token = require('../model/Token')
const {createCookie} = require('../utils/jwt')

const authenticateUser = async(req, res, next)=>{
 const {refreshToken, accessToken} = req.signedCookies

 
 try {
      if(accessToken){
          const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next();
        } 

        const payload = isTokenValid(refreshToken)
        

        const existingToken = await Token.findOne({
            user:payload.user.userId,
            refreshToken:payload.refreshToken
        }) 

        if(!existingToken || !existingToken?.isValid){
            throw new CustomError.UnAuthorized('Auntentication  invalid')
        }

        createCookie({
            res,
            user:payload.user,
            refreshToken:existingToken.refreshToken
        })
        req.user = payload.user;
        
        next();
    } catch (error) {
       throw new CustomError.UnAuthorized('Auntentication  invalid')
    }
};

const authorizeRole = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnAuthorized("Not authorized to access this route")
        }
    next()
    }
}

module.exports = {
    authenticateUser,
    authorizeRole
}