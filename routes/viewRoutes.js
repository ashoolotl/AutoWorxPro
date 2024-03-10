const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/login', viewsController.getLoginForm);
router.get('/', viewsController.getHomepage);

router.get('/dashboard', authController.protect, viewsController.getDashboard);
router.get(
    '/vehicle-classifications',
    authController.protect,
    authController.restrictTo('admin'),
    viewsController.getVehicleClassification
);
router.get(
    '/services',
    authController.protect,
    authController.restrictTo('admin'),
    viewsController.getServices
);
module.exports = router;
