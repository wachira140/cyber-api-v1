const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const checkPermission = require('../utils/checkPermission')

const Payments = require('../model/Payments')


const getAllPayments = async(req, res)=>{
        const payments = await Payments.find({})

        res.status(StatusCodes.OK).json({ payments, count:payments.length })
}



const getSinglePayment = async(req, res)=>{
    const { value:receipt } = req.params
    const payment = await Payments.findOne({ mpesaReceipt: receipt })
    
    if(!payment){
        throw new CustomError.NotFoundError(`No transaction with receipt of ${receipt}`)
    }
        const allowedUser = checkPermission(req.user, payment)

        if(!allowedUser){
            throw new CustomError.UnAuthorized('You are not authorized to view this order')
        }
res.status(StatusCodes.OK).json({ payment })
}

const currentUserPayments = async(req, res)=>{
    const { userId } = req.user
    const payments = await Payments.find({ user:userId})
    if(!payments){
        throw new CustomError.BadRequestError(`Error occured! try again later`)
    }
    

res.status(StatusCodes.OK).json({ payments, count:payments.length})
}


const updatePayment = async(req, res) =>{
    const { value:paymentId } = req.params
    const payment = await Payments.findByIdAndUpdate(
        { _id:paymentId },
             req.body
        )

        if(!payment){
            throw new CustomError.NotFoundError(`No payment with id of :${paymentId}`)
        }

    res.status(StatusCodes.OK).json({ payment })
}

const deletePayment = async(req, res)=>{
 const { value:paymentId } = req.params
    const payment = await Payments.findOne({ _id: paymentId })
    
    if(!payment){
        throw new CustomError.NotFoundError(`No payment with id of: ${paymentId}`)
    }

  await payment.remove()
  res.status(StatusCodes.OK).json({msg:'payment deleted'})
}


module.exports = {
    getAllPayments,
    getSinglePayment,
    currentUserPayments,
    updatePayment,
    deletePayment,
}