const mysql = require('mysql2');

const connectDB = () => {
    const pool = mysql.createPool({
        // host: process.env.DB_HOST,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME,
        host: "localhost",
        user: "root",
        password: "",
        database: "studio_sasvat",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.message);
            process.exit(1);
        } else {
            console.log(`MySQL connected with server: ${connection.config.host}`);
            connection.release();
        }
    });

    return pool.promise();
};

module.exports = connectDB;