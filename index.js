const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const readline = require('readline-sync')
const xlsx = require('xlsx')
const fs = require('fs')

dotenv.config()

// make transport
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

// configure templates 
const templateDir = path.resolve(__dirname, './template')

// handle bar option
const handlebarOption = {
    viewEngine: {
        extName: '.hbs',
        defaultLayout: false,
    },
    viewPath: templateDir,
    extName: '.hbs'
}

// make subject email
const subject = readline.question('Enter your subject: ')
const header = readline.question('Enter your header: ')
const message = readline.question('Enter your message-body: ')
const footer = readline.question('Enter your email-sender: ')

// read excel
const workbook = xlsx.readFile('list.xlsx')
const sheetName = workbook.SheetNames[0]
const receipents = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header: ['email', 'name']})

// list receipents 
// const receipents = [
//     {
//         email: 'webscraping48@gmail.com',
//         name: 'ijsamika'
//     },
//     {
//         email: 'ijsamika67@gmail.com',
//         name: 'gatotbim'
//     }
// ]

transport.use('compile', hbs(handlebarOption))


// loop to send bulk email
receipents.forEach((item)=> {
    
    // make options mail body
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: item.email,
        subject: subject,
        template: 'main',
        context: {
            email: item.email,
            name: item.name,
            header: header,
            message: message,
            footer: footer
        }
    }

    // send email
    transport.sendMail( mailOptions, (error, info) => {
        if(error){
            console.log(error)
        }else{
            console.log(`email sent to ${item.email}`)
        }
    })    
})




