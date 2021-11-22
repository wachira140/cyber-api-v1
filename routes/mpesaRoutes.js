const express = require('express')
const router = express.Router()
const { authenticateUser, authorizeRole } = require('../middleware/authentication')
const {getAuthToken} = require('../middleware/mpesaAuthentication')
const { lipaNaMpesa, lipaNaMpesaCallback } = require('../controllers/mpesaController')


router.route('/').get(getAuthToken)
router.route('/lipaNaMpesa').post(authenticateUser,getAuthToken, lipaNaMpesa)
router.route('/lipaNaMpesaCallback').post(lipaNaMpesaCallback)
module.exports = router