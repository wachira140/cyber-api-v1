const path = require('path')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadProductImage = async(req, res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('No File Uploaded')
    }
    const productImage = req.files.image

    const maxSize = 1024 * 1024

    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError('Please upload image smaller than 1MB')
    }

    const result = await cloudinary.uploader.upload(productImage.tempFilePath,{
        use_filename:true,
        folder:'cyber-app',
    })
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({image:{src:result.secure_url,public_id:result.public_id}})
}



module.exports = uploadProductImage