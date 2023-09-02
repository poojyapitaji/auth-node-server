require("dotenv").config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');
const generateLoggerUUID = require("./config/uuid");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(generateLoggerUUID);
logger(app);
app.use(cors(corsOptions));

app.use('/api/v1', require('./routes/v1/v1Routes'));

const { API_PORT } = process.env;

app.listen(API_PORT || 3001, () => {
    console.log(`Server is running. Listning on http://localhost:${API_PORT || 3001}`)
});
