const mongoose = require('mongoose');
const credentials = require("./credentials.js").db;

const dbUrl = 'mongodb://' + credentials.username +
	':' + credentials.password + '@' + credentials.host + ':' + credentials.port + '/' + credentials.database;

module.exports = mongoose.createConnection(dbUrl); // exporting mongoose connection
