const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(vehicleController.getAllVehicle)
    .post(vehicleController.createVehicle);

module.exports = router;
