require("dotenv").config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');
const generateLoggerUUID = require("./config/uuid");
const sequelize = require("./config/database");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(generateLoggerUUID);
logger(app);
app.use(cors(corsOptions));


//check if database connection
// sequelize.authenticate().then(() => sequelize.sync({ force: true })).catch(err => console.error(err));

//auth routes
app.use('/auth', require('./routes/auth'));
//user routes
app.use('/user', require('./routes/user'));
//log routes
app.use('/log', require('./routes/log'));

const { API_PORT } = process.env;

app.listen(API_PORT || 3001, () => {
    console.log(`Server is running. Listning on http://localhost:${API_PORT || 3001}`)
});
