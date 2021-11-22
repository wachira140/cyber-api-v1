const express = require('express')
const router = express.Router()

const { authenticateUser, authorizeRole } = require('../middleware/authentication')


const {
    getAllPayments,
    getSinglePayment,
    currentUserPayments,
    deletePayment,
    updatePayment,
} = require('../controllers/paymentController')

router.route('/').get(authenticateUser,authorizeRole('admin'),getAllPayments)
router.route('/currentUserPayments').get(authenticateUser,currentUserPayments)
router.route('/:value')
.get(authenticateUser,getSinglePayment)
.delete(authenticateUser,authorizeRole('admin'),deletePayment)
.patch(authenticateUser,authorizeRole('admin'),updatePayment)

module.exports = router