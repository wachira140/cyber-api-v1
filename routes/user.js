const express = require('express')
const router = express.Router()
const { authenticateUser, authorizeRole } = require('../middleware/authentication')

const { getAllUsers, getSingleUser,showCurrentUser } = require('../controllers/users')


router.route('/').get( authenticateUser, authorizeRole('admin'),getAllUsers)
router.route('/showUser').get(authenticateUser, showCurrentUser)
router.route('/:id').get(authenticateUser, authorizeRole('admin'),getSingleUser)


module.exports = router