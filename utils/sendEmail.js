// const nodemailer = require('nodemailer')
// const nodemailerConfig = require('./nodemailerConfig')


// const sendEmail = async({to, subject,html})=>{
//       let testAccount = await nodemailer.createTestAccount();

//         let transporter = nodemailer.createTransport(nodemailerConfig);



//     let info = await transporter.sendMail({
//     from: '"jb Cyber" <jbcyber@gmail.com>', // sender address
//     to, // list of receivers
//     subject, // Subject line
//     html, // html body
//   });
// }


const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const CustomError = require('../errors')

const sendEmail = async({to, subject,html})=>{

  const msg = {
    to,
    from:'wachiraw75@gmail.com',
    subject,
    html,
  }
try {
  
await sgMail.send(msg)
} catch (error) {
 throw new CustomError.BadRequestError('email not sent')

}

}




module.exports = sendEmail