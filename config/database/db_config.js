const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./system/db/mychasier.db')

module.exports = db