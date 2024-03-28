const Vehicle = require('../models/vehicleModel');
const VehicleClassification = require('../models/vehicleClassificationModel');
const Service = require('../models/servicesModel');
const Subscription = require('../models/subscriptionModel');
const Cart = require('../models/cartModel');
exports.getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getHomepage = (req, res, next) => {
    res.status(200).render('homepage');
};

exports.getDashboard = async (req, res, next) => {
    const user = req.user;
    const vehicleClassifications = await VehicleClassification.find();
    const vehicles = await Vehicle.find({ owner: user._id });

    console.log(user);
    res.status(200).render('dashboard', {
        title: 'Dashboard',
        user,
        vehicleClassifications,
        vehicles,
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
    if (res.locals.user === 'nouser') {
        console.log('no user');
    }
    let user = res.locals.user;
    console.log(user);
    let vehicles = undefined;
    if (user.role === 'user') {
        vehicles = await Vehicle.find({ owner: user._id });
    }

    res.status(200).render('services', {
        title: 'Services',
        services,
        vehicleClassification,
        user,
        vehicles,
    });
};

exports.getSubscriptions = async (req, res, next) => {
    const services = await Service.find();
    const subscriptions = await Subscription.find();
    const vehicleClassifications = await VehicleClassification.find();
    if (res.locals.user === 'nouser') {
        console.log('no user');
    }
    let user = res.locals.user;
    res.status(200).render('subscriptions', {
        title: 'Subscriptions',
        subscriptions,
        services,
        vehicleClassifications,
        user,
    });
};

exports.getRegister = async (req, res, next) => {
    res.status(200).render('register', {
        title: 'Create new Account',
    });
};

exports.getCart = async (req, res, next) => {
    let user = res.locals.user;
    let cartItems = undefined;

    if (user.role === 'user') {
        cartItems = await Cart.find({ owner: res.locals.user });
        console.log(cartItems);
    }
    res.status(200).render('cart', {
        title: 'Cart',
        cartItems,
        user,
    });
};
