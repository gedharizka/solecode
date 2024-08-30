var express = require('express');
var router = express.Router();
const configController = require('../controller/configController');

/* GET home page. */
router.post('/capacity', configController.setParkingCapacity);
router.post('/fee', configController.setParkingFee);

module.exports = router;
