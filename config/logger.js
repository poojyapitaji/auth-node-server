require('dotenv').config();
const morgan = require('morgan');
const json = require('morgan-json');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const Writable = require('stream').Writable;
const Log = require('../models/log');

class MyStream extends Writable {
    async write(line) {
        await Log.create({ log: line });
    }
}

const writer = new MyStream();

const formatDatabase = json({
    'remote-addr': ':remote-addr',
    'remote-user': ':remote-user',
    'log-date-time': '[:date]',
    method: ':method',
    url: ':url',
    'http-version': ':http-version',
    status: ':status',
    'content-length': ':res[content-length]',
    "user-agent": ":user-agent",
    'response-time': ':response-time ms'
});

const formatFile = ':id :remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

morgan.token('id', function getId(req) {
    return req.id
});

morgan.token('date', () => {
    return moment().tz(process.env.LOGGER_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
})

const logger = (app) => {
    const logger_mode = process.env.LOGGER_MODE
    if (!logger_mode) return;
    switch (logger_mode) {
        case 'file':
            const dir = path.join(__dirname, '../');
            app.use(morgan(formatFile, {
                stream: fs.createWriteStream(path.join(dir + "/log", 'access.log'), { flag: 'a' }),
                skip: (req, res) => { return req.originalUrl.startsWith('/log') }
            }));
        case 'database':
            app.use(morgan(formatDatabase, {
                stream: writer,
                skip: (req, res) => { return req.originalUrl.startsWith('/log') }
            }))
        default:
            return;
    }
}

module.exports = logger;