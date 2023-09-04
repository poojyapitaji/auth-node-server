const Sequelize = require('sequelize');
const nodemailer = require("nodemailer");

module.exports.checkDbConnection = async (req, res) => {
    const { dbHost, dbPort, dbName, dbUsername, dbPassword } = req.body
    var sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql'
    });
    try {
        await sequelize.authenticate()
        res.status(200).json({ check: 'pass' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ check: 'fail', message: error?.original?.sqlMessage })
    }

}

module.exports.checkSMTPConnection = async (req, res) => {
    const { smtpHost, smtpPort, smtpUsername, smtpPassword, smtpTestEmail } = req.body
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465 || smtpPort === '465' ? true : false,
        auth: {
            user: smtpUsername,
            pass: smtpPassword,
        },
        timeout: 60000
    });
    const payload = {
        from: `"Auth Node Server" <${smtpUsername}>`,
        to: smtpTestEmail,
        subject: "SMTP Connection Passed ✅",
        text: "If you have recieved this messege it means your configuration for SMTP is correct and working.",
    }
    try {
        let info = await transporter.sendMail(payload)
        console.log(info)
        res.status(200).json({ check: 'pass' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ check: 'fail' })
    }
}
