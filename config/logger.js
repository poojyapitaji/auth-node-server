require('dotenv').config();
const morgan = require('morgan');
const json = require('morgan-json');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const Writable = require('stream').Writable;
const Log = require('../models/log');

class DBStream extends Writable {
    async write(line) {
        await Log.create({ log: line });
    }
}

class FileStream extends Writable {
    write(line) {
        const dir = path.join(__dirname, '../log');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFileSync(path.join(dir, 'access.log'), line);
    }
}

const dbWriter = new DBStream();
const fileWrite = new FileStream();

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

const formatFile = ':id\tREMOTE_ADDRESS/:remote-addr\tREMOTE_USER/:remote-user\t[:date]\tMETHOD/:method\t:url\tSTATUS_CODE/:status\tCONTENT_LENGTH/:res[content-length]\tREFERANCE/:referrer\tUSER_AGENT/:user-agent\tHTTP/:http-version';

morgan.token('id', function getId(req) {
    return req.id
});

morgan.token('date', () => {
    return moment().tz(process.env.LOGGER_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
});

const logger = (app) => {
    const logger_mode = process.env.LOGGER_MODE
    if (!logger_mode) return;
    switch (logger_mode) {
        case 'file':
            app.use(morgan(formatFile, {
                stream: fileWrite,
                skip: (req, res) => { return req.originalUrl.startsWith('/log') }
            }));
            break;
        case 'database':
            app.use(morgan(formatDatabase, {
                stream: dbWriter,
                skip: (req, res) => { return req.originalUrl.startsWith('/log') }
            }))
            break;
        case 'default':
            app.use(morgan('short'));
        default:
            return;
    }
}

module.exports = logger;