const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router.route('/').get(subscriptionController.getAllSubscription).post(
    // subscriptionController.validateSubscriptionData,
    subscriptionController.uploadSubscriptionPhoto,
    subscriptionController.resizeSubscriptionPhoto,
    subscriptionController.createSubscription
);
//.post(serviceController.createService);

router
    .route('/:subscriptionId')
    .patch(
        subscriptionController.uploadSubscriptionPhoto,
        subscriptionController.resizeSubscriptionPhoto,
        // subscriptionController.validateSubscriptionData,
        subscriptionController.editSubscription
    )
    .delete(subscriptionController.deleteSubscription);

module.exports = router;
