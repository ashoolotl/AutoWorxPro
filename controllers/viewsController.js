const VehicleClassification = require('../models/vehicleClassificationModel');
const Service = require('../models/servicesModel');
const Subscription = require('../models/subscriptionModel');
exports.getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getHomepage = (req, res, next) => {
    res.status(200).render('homepage');
};

exports.getDashboard = (req, res, next) => {
    res.status(200).render('dashboard', {
        title: 'Dashboard',
    });
};

exports.getVehicleClassifications = async (req, res, next) => {
    const vehicleClassification = await VehicleClassification.find();

    res.status(200).render('vehicleClassification', {
        title: 'Vehicle Classification',
        vehicleClassification,
    });
};

exports.getServices = async (req, res, next) => {
    const services = await Service.find();
    const vehicleClassification = await VehicleClassification.find();

    res.status(200).render('services', {
        title: 'Services',
        services,
        vehicleClassification,
    });
};

exports.getSubscriptions = async (req, res, next) => {
    const services = await Service.find();
    const subscriptions = await Subscription.find();

    res.status(200).render('subscriptions', {
        title: 'Subscriptions',
        subscriptions,
        services,
    });
};

exports.getRegister = async (req, res, next) => {
    res.status(200).render('register', {
        title: 'Create new Account',
    });
};
