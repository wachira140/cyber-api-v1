const Order = require('../model/Orders')
const Products = require('../model/Products')
const Payments = require('../model/Payments')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const checkPermission = require('../utils/checkPermission')


const createOrder = async(req, res)=>{
   const { cartItems, transport, location,contact,courier,pick_up }= req.body
    
   if(!cartItems){
       throw new CustomError.BadRequestError('No cart items in the order')
   }
   let orderItems = []
   let subtotal = 0

   for(const item of cartItems){
       const product = await Products.findById(item.product)
       const { name, brand, color,price,image, _id} = product
        
       subtotal+= item.amount*price
       
       const singleOrderItem = {
           product:_id,
           name,
           brand,
           color,
           amount:item.amount,
           price,
           image,
        }
        
        orderItems = [...orderItems, singleOrderItem]
    }
    const total = subtotal + transport

const order = await Order.create({
    orderItems,
    name:req.user.name,
    user:req.user.userId,
    contact,
    location,
    courier,
    pick_up,
    subtotal,
    transport,
    total,
})
// console.log(order)

res.status(StatusCodes.CREATED).json({order})
}

// all orders
const getAllOrder = async(req, res)=>{

    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}

// single order
const getSingleOrder = async(req, res)=>{
    const {id:orderId} = req.params
   
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError(`No order with id of ${orderId}`)
    }
  const allowedUser = checkPermission(req.user, order)

  if(!allowedUser){
      throw new CustomError.UnAuthorized('You are not authorized to view this order')
  }
    res.status(StatusCodes.OK).json({order})
}
// all users order

const getAllUserOrders = async(req, res)=>{
    const { userId} = req.user
    const orders = await Order.find({user:userId})

    res.status(StatusCodes.OK).json({orders, count:orders.length})
}


// update order
const updateOrder = async(req, res)=>{
    const {id:orderId} = req.params


    
     const order = await Order.findByIdAndUpdate(
        { _id:orderId },
             req.body
        )

    if(!order){
        throw new CustomError.NotFoundError(`No order with id of ${orderId}`)
    }
  const allowedUser = checkPermission(req.user, order)

  if(!allowedUser){
      throw new CustomError.UnAuthorized('You are not authorized to view this order')
  }

  res.status(StatusCodes.OK).json({order})

}




const deleteOrder = async(req, res)=>{
        const {id:orderId} = req.params
       
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError(`No order with id of ${orderId}`)
    }
  const allowedUser = checkPermission(req.user, order)

  if(!allowedUser){
      throw new CustomError.UnAuthorized('You are not authorized to delete this order')
  }

  await order.remove()
  res.status(StatusCodes.OK).json({msg:'order deleted'})
}

module.exports = {
    createOrder,
    getAllOrder,
    getSingleOrder,
    updateOrder,
    deleteOrder,
    getAllUserOrders,
}