const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router.get(
    '/checkout-session/:userId',
    authController.protect,
    bookingController.getCheckoutSession
);
router.get('/', bookingController.getAllBookings);

module.exports = router;
