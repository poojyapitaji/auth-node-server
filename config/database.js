require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        dialect: "mysql",
        timezone: process.env.MYSQL_TIMEZONE,
        host: process.env.MYSQL_HOST
    }
);

module.exports = sequelize;