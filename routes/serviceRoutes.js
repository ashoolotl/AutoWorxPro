const express = require('express');
const serviceController = require('../controllers/serviceController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(serviceController.getAllServices)
    .post(
        serviceController.validateServiceData,
        serviceController.createService
    );

router
    .route('/:serviceId')
    .patch(
        serviceController.validateServiceData,
        serviceController.updateSubscriptionWithService,
        serviceController.editService
    )
    .delete(
        serviceController.deleteServiceWithSubscription,
        serviceController.deleteService
    );

module.exports = router;
