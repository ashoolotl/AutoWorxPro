const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

router
    .route('/')
    .get(subscriptionController.getAllSubscription)
    .post(subscriptionController.createSubscription);
//.post(serviceController.createService);

router.route('/:serviceId');
// .patch(serviceController.editService)
// .delete(serviceController.deleteService);

module.exports = router;
