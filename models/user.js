const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("users", {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

User.addScope('defaultScope', {
    attributes: {
        exclude: ['password']
    },
    order: [['createdAt', 'DESC']]
});

User.addScope('withPassword', {
    attributes: {
        include: ['password']
    },
    order: [['createdAt', 'DESC']]
});

User.sync();

module.exports = User;