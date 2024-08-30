var express = require('express');
var router = express.Router();
const vehiclesController = require('../controller/vehiclesController');

/* GET home page. */
router.post('/', vehiclesController.addVehicle);
router.get('/', vehiclesController.getParkedVehicles);
router.post('/checkout', vehiclesController.checkoutVehicle);
router.get('/:dateFrom/:dateTo', vehiclesController.getVehiclesByDate);

module.exports = router;
