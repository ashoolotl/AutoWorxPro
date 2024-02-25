const Service = require('../models/servicesModel');
const Subscription = require('../models/subscriptionModel');
const VehicleClassification = require('../models/vehicleClassificationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateServiceData = catchAsync(async (req, res, next) => {
    const { prices, name } = req.body;

    // first step check if it is a patch request
    if (req.method === 'PATCH') {
        const doesServiceExist = await Service.findById(req.params.serviceId);
        if (!doesServiceExist) {
            return next(new AppError(`There is no service with that id`, 400));
        }
    }
    if (name) {
        // next step is to check if the client wants to change the service name but it is already registered send an error
        const services = await Service.find().distinct('name');
        const servicesSet = new Set(services);
        // check if the name is duplicate
        let serviceNameUpperCase = name.toUpperCase();
        if (servicesSet.has(serviceNameUpperCase)) {
            return next(
                new AppError(
                    `The ${serviceNameUpperCase} is already a registered service. Please choose another service name.`
                )
            );
        }
    }
    if (prices) {
        // check if the input is a valid vehicle classification
        const vehicleClassificationList =
            await VehicleClassification.find().distinct('name');
        const vehicleClassificationSet = new Set(vehicleClassificationList);
        for (price of prices) {
            price.vehicleClassification =
                price.vehicleClassification.toUpperCase();
            if (!vehicleClassificationSet.has(price.vehicleClassification)) {
                return next(
                    new AppError(
                        `There is no ${price.vehicleClassification} registered as a vehicle classification. Please use another vehicle classification`,
                        400
                    )
                );
            }
        }
    }
    next();
});

exports.getAllServices = catchAsync(async (req, res, next) => {
    const services = await Service.find().select('-__v');
    res.status(200).json({
        status: 'success',
        results: services.length,
        data: {
            services,
        },
    });
});

exports.createService = catchAsync(async (req, res, next) => {
    // validate that the vehicle classification is only

    const newService = await Service.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            services: newService,
        },
    });
});

exports.updateSubscriptionWithService = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE SERVICE WITH SUBSCRIPTION');
    const service = await Service.findById(req.params.serviceId).distinct(
        'name'
    );
    if (!service) {
        return next(new AppError('No classification found with that id', 400));
    }

    const subscriptions = await Subscription.find({
        'prices.service': service[0],
    });

    // Iterate over each subscription document and update
    for (const subscription of subscriptions) {
        // Get the token amount from the current subscription
        const tokenAmount = subscription.prices[0].tokensAmount;

        // Update operation for the current subscription
        await Subscription.updateOne(
            { 'prices.service': service[0] }, // Match by subscription ID
            {
                $set: {
                    'prices.$[elem].service': req.body.name,
                    description: tokenAmount + ' ' + req.body.name,
                },
            },
            {
                arrayFilters: [{ 'elem.service': service[0] }],
                new: true,
                runValidators: true,
            }
        );
    }

    return next();
});

exports.editService = catchAsync(async (req, res, next) => {
    const service = await Service.findByIdAndUpdate(
        req.params.serviceId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!service) {
        return next(new AppError('No service found with that id', 400));
    }
    console.log('SAVING THIS SERVICE');
    // await service.save();
    // to run the middleware that checks if valid vehicle classification is placed
    res.status(200).json({
        status: 'success',
        data: {
            service,
        },
    });
});
exports.deleteServiceWithSubscription = catchAsync(async (req, res, next) => {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
        return next(new AppError('No classification found with that id', 404));
    }

    const subscriptionsToUpdate = await Subscription.find({
        'prices.service': service.name,
    });

    for (const subscription of subscriptionsToUpdate) {
        // If the service has only one price remaining and it matches the classification to delete, delete the service
        if (
            subscription.prices.length === 1 &&
            subscription.prices[0].service === service.name
        ) {
            await Subscription.findByIdAndDelete(subscription._id);
        } else {
            await Subscription.updateMany(
                {
                    'prices.service': service.name,
                },
                {
                    $pull: {
                        prices: { service: service.name },
                    },
                },
                {
                    new: true,
                    runValidators: false,
                }
            );
        }
    }
    next();
});
exports.deleteService = catchAsync(async (req, res, next) => {
    const service = await Service.findByIdAndDelete(req.params.serviceId);
    if (!service) {
        return next(new AppError('No service found with that id', 400));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
