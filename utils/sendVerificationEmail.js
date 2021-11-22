const sendEmail = require('./sendEmail')



const sendVerificationEmail = async({name, email, verificationToken, origin})=>{

    const verifyLink = `${origin}/user/verify-token?token=${verificationToken}&email=${email}`
const message = `<p>Please confirm your email :
<a href="${verifyLink}">click to verify Email</a> </p> `

    return sendEmail({to:email, subject:'Email confirmation',
    html:`<h4>Hello, ${name}</h4>
    ${message}`
    
})
}

module.exports = sendVerificationEmail