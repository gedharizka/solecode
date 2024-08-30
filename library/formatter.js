const connection = require("../database/database_cloud");

const calculateParkingFee = (duration, callback) => {
    const firstHourFee = 5000

    // Query untuk mendapatkan subsequentHourFee dari tabel parking_config
    const query = 'SELECT fee_per_hour FROM parking_config LIMIT 1';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching subsequent hour fee:', err);
            return callback(err, null);
        }

        const subsequentHourFee = parseInt(results[0].fee_per_hour);

        let totalFee;
        if (duration <= 1) {
            totalFee = firstHourFee;
        } else {
            totalFee = firstHourFee + (duration - 1) * subsequentHourFee;
        }
        // Mengembalikan totalFee melalui callback
        callback(null, totalFee);
    });
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports ={
    calculateParkingFee,
    formatNumber
}