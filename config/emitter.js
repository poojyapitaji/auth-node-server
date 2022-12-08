const EventEmitter = require('events');
const mailService = require('../services/mail');

class Emitter extends EventEmitter {}
const emitter =  new Emitter();

//register events here
emitter.on('sendMail', (data) => mailService.sendMail(data));

module.exports = emitter;