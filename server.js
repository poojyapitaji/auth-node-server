require("dotenv").config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');
const generateLoggerUUID = require("./config/uuid");
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(generateLoggerUUID);

const envExists = fs.existsSync('.env');
const installKey = process.env.INSTALL === 'false';

const API_PORT = process.env.API_PORT || 3001;

if (!envExists || !installKey) {
    const controller = require('./controllers/install');
    app.use('/install', express.static(__dirname + '/install'));
    app.use('/install/checkdb', controller.checkDbConnection);
    app.use('/install/checkSMTP', controller.checkSMTPConnection);
    app.get('*', function (req, res) {
        res.redirect('/install')
    })
    app.listen(API_PORT, () => {
        console.log(`Go to this link to setup the server http://localhost:${API_PORT}/install`);
    });
} else {
    logger(app);
    app.use(cors(corsOptions));
    app.use('/api/v1', require('./routes/v1/v1Routes'));
    app.listen(API_PORT, () => {
        console.log(`Server is running. Listening on http://localhost:${API_PORT}`);
    });
}