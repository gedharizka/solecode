const connection = require("./database_cloud");



    const migrations = `
    
        CREATE DATABASE IF NOT EXISTS parking_db;

        USE parking_db;

        CREATE TABLE IF NOT EXISTS vehicles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            license_plate VARCHAR(15) NOT NULL,
            entry_time DATETIME NOT NULL,
            exit_time DATETIME,
            is_parked BOOLEAN DEFAULT true,
            total_fee DECIMAL(10, 2) DEFAULT 0.00
        );

        CREATE TABLE IF NOT EXISTS parking_config (
            id INT AUTO_INCREMENT PRIMARY KEY,
            capacity INT DEFAULT 0,
            fee_per_hour DECIMAL(10, 2) DEFAULT 0.00
        );

        INSERT INTO parking_config (capacity, fee_per_hour)
        VALUES (50, 5000) ON DUPLICATE KEY UPDATE capacity=VALUES(capacity), fee_per_hour=VALUES(fee_per_hour);
    `;

connection.query(migrations, (err, results) => {
    if (err) {
        console.error('Migration failed:', err);
    } else {
        console.log('Migration completed successfully.');
    }
    connection.end();
});


connection
