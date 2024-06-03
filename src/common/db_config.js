var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST_API,
    user            : process.env.DB_USER_API,
    password        : process.env.DB_PWD_API,
    database        : process.env.DB_NAME_API,
    timezone        : 'utc',
    supportBigNumbers: true,
    multipleStatements: true
});



module.exports = pool;
