const Vehicle = require('../models/vehicleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllVehicle = catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find();
    res.status(200).json({
        status: 'success',
        length: vehicles.length,
        data: {
            vehicle: vehicles,
        },
    });
});

exports.createVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.create(req.body);
    console.log(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            vehicle,
        },
    });
});
