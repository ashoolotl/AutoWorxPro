const Service = require('../models/servicesModel');
const VehicleClassification = require('../models/vehicleClassificationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateServiceData = catchAsync(async (req, res, next) => {
    const { prices } = req.body;
    const vehicleClassifications = await VehicleClassification.find().distinct(
        'name'
    );
    for (let price of prices) {
        price.vehicleClassification = price.vehicleClassification.toUpperCase();

        if (!vehicleClassifications.includes(price.vehicleClassification)) {
            return next(
                new AppError(
                    `${price.vehicleClassification} is not a vehicle classification. Please select another vehicle classification`,
                    400
                )
            );
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
        return next(new AppError('No service found with that id', 404));
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

exports.deleteService = catchAsync(async (req, res, next) => {
    const service = await Service.findByIdAndDelete(req.params.serviceId);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
