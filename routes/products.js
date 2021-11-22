const express = require('express')
const router = express.Router()
const { authenticateUser, authorizeRole } = require('../middleware/authentication')


const {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/products')

const uploadProductImage = require('../controllers/uploadsContoller')


router.route('/').get(getAllProducts).post( authenticateUser, authorizeRole('admin'),createProduct)
router.route('/uploads').post(uploadProductImage)
router.route('/:id').get(getSingleProduct).patch(authenticateUser, authorizeRole('admin'),updateProduct).delete(authenticateUser, authorizeRole('admin'),deleteProduct)

module.exports = router