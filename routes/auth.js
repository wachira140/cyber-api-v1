const express = require('express')
const router = express.Router()
const { register, verifyEmail, login, logout, resetPassword, forgotPassword } = require('../controllers/auth')
const { authenticateUser } =require('../middleware/authentication')

router.post('/register',register)
router.post('/verify-email',verifyEmail)
router.post('/login', login)
router.delete('/logout',authenticateUser, logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router