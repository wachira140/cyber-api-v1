const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const axios = require('axios').default;
require('dotenv').config();


const getAuthToken = async(req, res, next)=>{
const consumer_key = process.env.CONSUMER_KEY
const consumer_secret = process.env.CONSUMER_SECRET
const url = process.env.OAUTH_TOKEN_URL

const buffer = Buffer.from(consumer_key+":"+consumer_secret)
const auth = `Basic ${buffer.toString('base64')}`

try {
    const{data} = await axios.get(url,{
        "headers":{
            "Authorization":auth
        }
    })
   req.token = data
   next()
} catch (error) {
    throw new CustomError.BadRequestError('Authorization failed')
}
    
}

module.exports ={
    getAuthToken,
}