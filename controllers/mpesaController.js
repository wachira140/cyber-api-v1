
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const axios = require('axios').default;
require('dotenv').config();
const date = require('date-and-time');


const Order = require('../model/Orders')
const Products = require('../model/Products')
const Payments = require('../model/Payments')



const lipaNaMpesa = async(req, res)=>{
    const token = req.token.access_token
    const auth = `Bearer ${token}`
    const user = req.user

    const { phoneNumber, orderId } = req.body


    const specificOrder = await Order.findOne({ _id: orderId})

    if(!specificOrder){
        throw new CustomError.BadRequestError(`No order with id of ${orderId} found, please create another order and submit`)
    }

    // check if the order is already paid for
    if(specificOrder.status === 'paid'){
        throw new CustomError.BadRequestError(`payment for order id:${orderId} is already settled`)
    }



    const {total} = specificOrder


    const amount = total
    const order = orderId


   const now = new Date() 
   const timeStamp = date.format(now,'YYYYMMDDHHmmss');  
   
  
   
   const url = process.env.LIPA_NA_MPESA_URL
   const mpesaCallbackUrl = process.env.MPESA_CALLBACK_URL
   
    
    const passKey=process.env.PASS_KEY
    const partyB = process.env.PARTY_B
    const shortCode = process.env.SHORT_CODE

   const partyA = phoneNumber
    const transcation_type = "CustomerPayBillOnline"
    const accountReference = "JBCYBER AND PRINTERS"
    const transactionDesc = 'Test'
    const callbackUrl = `${mpesaCallbackUrl}/api/v1/mpesa/lipaNaMpesaCallback`



    const passWord = Buffer.from(`${shortCode}${passKey}${timeStamp}`).toString('base64')


    try {
        
        const {data} = await axios.post(url,{
                  
                    "BusinessShortCode":shortCode,
                    "Password":passWord,
                    "Timestamp":timeStamp,
                    "TransactionType":transcation_type,
                    "Amount":amount,
                    "PartyA":partyA,
                    "PartyB":partyB,
                    "PhoneNumber":phoneNumber,
                    "CallBackURL":callbackUrl,
                    "AccountReference":accountReference,
                    "TransactionDesc":transactionDesc
        },{
            "headers":{
                "Authorization":auth
            }
        })

        const {CheckoutRequestID,MerchantRequestID } = data;
        const payment = await Payments.create({
          user: user.userId,
          name:user.name,
          order,
          checkoutrequestId: CheckoutRequestID,
          merchantRequestId: MerchantRequestID,
          phoneNumber,
          amount,
        })

       return  res.status(StatusCodes.CREATED).json({ payment })
      
    } catch (error) {
        throw new CustomError.BadRequestError('Transaction not processed')
    }
}


// mpesa will post the transaction status and we update our payment and orders according the transaction status

const lipaNaMpesaCallback =async (req, res)=>{
    const data = req.body.Body.stkCallback
    const { CheckoutRequestID, CallbackMetadata,ResultCode } = data



    const payment = await Payments.findOne({checkoutrequestId: CheckoutRequestID})
        if(!payment){
            throw new CustomError.NotFoundError(`No transaction with id of ${CheckoutRequestID}`)
        }


        // update order as paid
    const order = await Order.findOne({_id:payment.order})
    
    
    if(ResultCode === 0){
        order.status = 'paid'
        payment.status = 'completed'
        
    } else{
        payment.status = 'failed'
        order.status = 'failed'
        await payment.save()
        await order.save()
    
    return res.status(StatusCodes.OK).json({ payment, order });
    }


// update payment details
    
    for (const payDetails of CallbackMetadata.Item){
            if(payDetails.Name === 'Amount'){
                payment.amount = payDetails.Value
            }
            if(payDetails.Name === 'MpesaReceiptNumber'){
                payment.mpesaReceipt = payDetails.Value
            }
            if(payDetails.Name === 'PhoneNumber'){
                payment.phoneNumber = payDetails.Value
            }
        }
       
         
         
    await order.save()
     await payment.save()
   
    res.status(StatusCodes.OK).json({ payment, order });
}






module.exports = {
   lipaNaMpesa,
   lipaNaMpesaCallback,
}