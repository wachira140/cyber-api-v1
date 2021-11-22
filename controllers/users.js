const User = require('../model/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getAllUsers = async (req, res)=>{
    
    const users = await User.find({ role :'user'}).select('-password')
    res.status(StatusCodes.OK).json({ users })
}
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const getSingleUser = async(req, res)=>{
    
    const user = await User.findById({ _id:req.params.id}).select('-password').select('-role')
    if(!user){
        throw new CustomError.NotFoundError(`No user with id of : ${req.params.id}`)
    }

    res.status(StatusCodes.OK).json({ user })
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser
}