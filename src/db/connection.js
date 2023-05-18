const mysql = require('mysql2/promise');

// const connection = mysql.createPool({
//    host: 'db',
//    port: 3306,
//    user: 'root',
//    password: 'password',
//    database: 'TalkerDB',
//    waitForConnections: true,
//    connectionLimit: 10,
//    queueLimit: 0, 
// });

const connection = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, 
 });
 
// passa no local, mas não passa no github

module.exports = connection;