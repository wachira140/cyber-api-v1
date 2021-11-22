const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) =>{
    let customError = {
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    }

    if(err.name === 'CastError'){
        if(err.value){
            customError.msg  = `No product with id of ${err.value}`,
            customError.statusCode = 400
        }
        if(err.value._id){
            customError.msg  = `No product with id of ${err.value._id}`,
            customError.statusCode = 400
        }
        
    }

    return res.status(customError.statusCode).json({ msg: customError.msg})
}
module.exports = errorHandlerMiddleware;