const Sequelize = require('sequelize');

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