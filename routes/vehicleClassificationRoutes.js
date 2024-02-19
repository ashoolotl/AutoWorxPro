const express = require('express');
const vehicleClassification = require('../controllers/vehicleClassificationController');

const router = express.Router();

// we need to protect this route
router
    .route('/')
    .get(vehicleClassification.getAllClassification)
    .post(vehicleClassification.createClassification);

router
    .route('/:classificationId')
    .patch(
        vehicleClassification.updateServiceWithVehicleClass,
        vehicleClassification.updateClassification
    )
    .delete(
        vehicleClassification.deleteServiceWithVehicleClass,
        vehicleClassification.deleteClassification
    );

module.exports = router;
