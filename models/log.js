const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Log = sequelize.define("logs", {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true
    },
    log: {
        type: Sequelize.JSON,
        allowNull: false,
        get: function () {
            return JSON.parse(JSON.parse(this.getDataValue('log')));
        },
    }
});

Log.addScope('defaultScope', {
    order: [['createdAt', 'DESC']]
});

module.exports = Log;