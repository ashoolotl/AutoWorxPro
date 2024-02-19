const express = require('express');
const serviceController = require('../controllers/serviceController');

const router = express.Router();

router
    .route('/')
    .get(serviceController.getAllServices)
    .post(
        serviceController.validateServiceData,
        serviceController.createService
    );

router
    .route('/:serviceId')
    .patch(serviceController.validateServiceData, serviceController.editService)
    .delete(serviceController.deleteService);

module.exports = router;
