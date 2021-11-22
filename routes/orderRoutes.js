const express = require('express');
const router = express.Router()
const { authenticateUser, authorizeRole } = require('../middleware/authentication')

const {
    createOrder,
    getAllOrder,
    getSingleOrder,
    updateOrder,
     getAllUserOrders,
    deleteOrder,
} = require('../controllers/ordersController')


router.route('/')
.get(authenticateUser, authorizeRole('admin'),getAllOrder)
.post( authenticateUser,createOrder)

router.route('/showUsersOrders').get( authenticateUser,getAllUserOrders,)

router.route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser,updateOrder)
    .delete(authenticateUser,deleteOrder)

module.exports = router