const express = require('express');
const bookingSubscriptionController = require('../controllers/bookingSubscriptionController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);

router.route('/').get(bookingSubscriptionController.getAllBookingSubscription);
module.exports = router;
