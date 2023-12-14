const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

// make transport
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

// make options mail body
const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'example@gmail.com',
    subject: 'Morning',
    text: 'Hello from automation'
}

// send email
transport.sendMail( mailOptions, (error, info) => {
    if(error){
        console.log(error)
    }else{
        console.log(`email sent to ${mailOptions.to}`)
    }
})


