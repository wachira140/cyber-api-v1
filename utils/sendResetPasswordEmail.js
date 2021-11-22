const sendEmail = require('./sendEmail')


const sendResetPasswordEmail = async({name, email, token, origin})=>{
    const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `<p>Please click the following link to reset password : 
    <a href="${resetUrl}">click to Reset password</a></p>`

    return sendEmail({
         to:email,
         subject:'Reset password',
         html:`<h4>Hello,${name}</h4>
         ${message}`,
})
}

module.exports = sendResetPasswordEmail