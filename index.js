require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require("./config/database");

// routes
const auth = require('./routes/auth');

const app = express();
const { API_PORT } = process.env;
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

//check if database connection
sequelize.authenticate().then(() => sequelize.sync()).catch(err => console.log(err));

//auth routes
app.use('/auth', auth);

app.listen(API_PORT || 3001, () => {
    console.log(`Server is running. Listning on http://localhost:${API_PORT || 3001}`)
});
