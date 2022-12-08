require('dotenv').config();
const mail = require('../config/mail');
const fs = require('fs');
const handlebars = require('handlebars');

module.exports.sendMail = async ({ to, subject, text = "", template = "", data = {} }) => {
    const senderAddress = `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`
    if (template !== "") {
        readHTMLFile(`/../templates/${template}.html`, (err, html) => {
            if (err) {
                console.log('error loading email templates. ', err);
                return;
            }
            let template = handlebars.compile(html);
            mail({ from: senderAddress, to, subject, html: `${template(data)}` })
            return;
        })
    }else {
        mail({ from: senderAddress, to, subject, text })
    }
}

const readHTMLFile = (path, callback) => {
    fs.readFile(__dirname + path, {
        encoding: 'utf-8'
    }, (err, html) => {
        if (err) {
            callback(err);
        } else {
            callback(null, html);
        }
    })
}

