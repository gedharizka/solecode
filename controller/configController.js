const connection = require("../database/database_cloud");

// Konfigurasi kapasitas parkir
exports.setParkingCapacity = (req, res) => {
    const { capacity } = req.body;
    const query = 'UPDATE parking_config SET capacity = ?';
    connection.query(query, [capacity], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Parking capacity updated successfully' });
    });
};

// Konfigurasi biaya parkir
exports.setParkingFee = (req, res) => {
    const { fee } = req.body;
    const query = 'UPDATE parking_config SET fee_per_hour = ?';
    connection.query(query, [fee], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Parking fee updated successfully' });
    });
};