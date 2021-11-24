const jwt = require('jsonwebtoken')




const createJwtToken = ({payload})=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    return token
}


const isTokenValid = (token)=>jwt.verify(token,process.env.JWT_SECRET)

const longerExp = 1000 * 60 * 60 * 24 * 30;
const oneDay = 1000 * 60 * 60 * 24;

const createCookie = ({res, user, refreshToken})=>{
    const accessTokenJwt = createJwtToken({payload:{ user}})
    const refreshTokenJwt = createJwtToken({payload:{ user, refreshToken}})
  
    res.cookie('accessToken',accessTokenJwt,{
        httpOnly:true,
        expires: new Date(Date.now()+ oneDay),
        secure:process.env.NODE_ENV ==='production',
        signed:true,
        sameSite = "None"
    })
    res.cookie('refreshToken',refreshTokenJwt,{
        httpOnly:true,
        expires: new Date(Date.now()+ longerExp),
        secure:process.env.NODE_ENV ==='production',
        signed:true,
        sameSite = "None"
    })
}



module.exports = {
    createJwtToken,
    isTokenValid,
    createCookie,
}