const mysql = require('mysql2/promise');

const connection = mysql.createPool({
   host: 'db',
   port: 3306,
   user: 'root',
   password: 'password',
   database: 'TalkerDB',
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0, 
});

// passa no local, mas não passa no github

module.exports = connection;