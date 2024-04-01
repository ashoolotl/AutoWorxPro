const express = require('express');
const availedSubscriptionController = require('../controllers/availedSubscriptionController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        availedSubscriptionController.getAllSubscriptionsAvailed
    );

router
    .route('/:userId')
    .get(
        authController.protect,
        availedSubscriptionController.getAvailedSubscriptionById
    );
module.exports = router;
