const connection = require("../database/database_cloud");
const moment = require("moment")
const { calculateParkingFee, formatNumber } = require("../library/formatter");

exports.addVehicle = (req, res) => {
    const { license_plate } = req.body;

    // Query untuk memeriksa apakah nomor plat kendaraan sudah ada dan sedang parkir
    const checkDuplicateQuery = 'SELECT * FROM vehicles WHERE license_plate = ? AND is_parked = true';

    connection.query(checkDuplicateQuery, [license_plate], (err, results) => {
        if (err) {
            console.error('Error checking duplicate license plate:', err);
            return res.status(500).send({ error: 'Failed to check duplicate license plate.' });
        }

        if (results.length > 0) {
            // Jika ada kendaraan dengan nomor plat yang sama sedang parkir
            return res.status(400).send({ error: 'This vehicle is already parked.' });
        }

        // Query untuk memeriksa kapasitas parkir dan jumlah kendaraan yang terparkir
        const checkCapacityQuery = `
            SELECT capacity, 
                   (SELECT COUNT(*) FROM vehicles WHERE is_parked = true) AS parked_count 
            FROM parking_config LIMIT 1;
        `;

        connection.query(checkCapacityQuery, (err, results) => {
            if (err) {
                console.error('Error checking capacity:', err);
                return res.status(500).send({ error: 'Failed to check parking capacity.' });
            }

            const capacity = results[0].capacity;
            const parkedCount = results[0].parked_count;

            if (parkedCount >= capacity) {
                // Jika kapasitas sudah penuh
                return res.status(400).send({ error: 'Parking lot is full. Cannot park more vehicles.' });
            } else {
                // Jika kapasitas masih tersedia, tambahkan kendaraan
                const enterTime =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                // const enterTime = "2024-08-05 18:10:52"
                const insertVehicleQuery = 'INSERT INTO vehicles (license_plate, entry_time, is_parked) VALUES (?, ?, true)';
                connection.query(insertVehicleQuery, [license_plate, enterTime], (err, results) => {
                    if (err) {
                        console.error('Error inserting vehicle:', err);
                        return res.status(500).send({ error: 'Failed to park the vehicle.' });
                    }
                    res.send({ id: results.insertId, license_plate, message: 'Vehicle parked successfully.' });
                });
            }
        });
    });
};

exports.getParkedVehicles = (req, res) => {
    const query = 'SELECT  id, license_plate, entry_time, exit_time, is_parked, total_fee FROM vehicles WHERE is_parked = 1 ORDER BY id DESC';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        const formatRes = results.map(vehicle => {
            return {
                id: vehicle.id,
                license_plate: vehicle.license_plate,
                entry_time: moment(vehicle.entry_time).format("DD-MM-YYYY HH:mm:ss"),
                exit_time: vehicle.exit_time ? moment(vehicle.exit_time).format("DD-MM-YYYY HH:mm:ss") : "-",
                is_parked: vehicle.is_parked === 1 ?  "Parked" : "Has left",
                total_fee: `Rp ${formatNumber(vehicle.total_fee)}`
            }
        })
        res.send(formatRes);
    });
};

exports.checkoutVehicle = (req, res) => {
    const { id } = req.body;
    const getVehicleQuery = 'SELECT * FROM vehicles WHERE id = ?';
    connection.query(getVehicleQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'Vehicle not found' });
        }

        const vehicle = results[0];

        if (!vehicle.is_parked) {
            return res.status(400).send({ error: 'This vehicle has already been checked out.' });
        }

        const exitTime = new Date();
        const entryTime = new Date(vehicle.entry_time);

        const timeSpend = exitTime - entryTime
        const hoursSpend = timeSpend / (1000 * 60 * 60)
        const duration = Math.ceil(hoursSpend); // Durasi dalam jam

        calculateParkingFee(parseInt(duration), (err, totalFee) => {
            if (err) {
                return res.status(500).send({ error: 'Failed to calculate parking fee.' });
            }

            const updateQuery = 'UPDATE vehicles SET exit_time = NOW(), is_parked = false, total_fee = ? WHERE id = ?';
            connection.query(updateQuery, [totalFee, id], (err, updateResults) => {
                if (err) {
                    return res.status(500).send({ error: 'Failed to checkout vehicle.' });
                }
                res.send({
                    message: 'Vehicle checked out successfully.',
                    license_plate: vehicle.license_plate,
                    entry_time: moment(entryTime).format("DD-MM-YYYY h:mm:ss"),
                    exit_time: moment(exitTime).format("DD-MM-YYYY h:mm:ss"),
                    duration: `${duration} Jam`,
                    total_fee: `Rp ${formatNumber(totalFee)}`,
                });
            });
        })
    });
};

exports.getVehiclesByDate = (req, res) => {
    const { dateFrom, dateTo } = req.params;
    const convertDateForm = new Date(dateFrom + " 00:00:00")
    const convertDateTo = new Date(dateTo + " 23:59:59")
    const query =  `SELECT id, license_plate, entry_time, exit_time, is_parked, total_fee 
        FROM vehicles 
         WHERE entry_time >= ? 
        AND entry_time <= ?`;
    connection.query(query, [convertDateForm, convertDateTo], (err, results) => {
        
        if (err) {
            return res.status(500).send(err);
        }
        const formatRes= results.map((vehicle) => {
            return {
                id: vehicle.id,
                license_plate: vehicle.license_plate,
                entry_time: moment(vehicle.entry_time).format("DD-MM-YYYY HH:mm:ss"),
                exit_time: vehicle.exit_time ? moment(vehicle.exit_time).format("DD-MM-YYYY HH:mm:ss") : "-",
                is_parked: vehicle.is_parked,
                total_fee: `Rp ${formatNumber(vehicle.total_fee)}`
            }
        })
        res.send(formatRes);
    });
  };

