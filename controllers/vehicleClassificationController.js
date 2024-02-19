const VehicleClassification = require('../models/vehicleClassificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Service = require('../models/servicesModel');

exports.createClassification = catchAsync(async (req, res, next) => {
    const newClassification = await VehicleClassification.create(req.body);
    res.status(200).json({
        status: 'Success',
        data: {
            vehicleClassification: newClassification,
        },
    });
});

exports.getAllClassification = catchAsync(async (req, res, next) => {
    const classification = await VehicleClassification.find().select('-__v');
    res.status(200).json({
        status: 'Success',
        results: classification.length,
        data: {
            vehicleClassification: classification,
        },
    });
});
exports.updateServiceWithVehicleClass = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE SERVICE WITH CLASS');
    const vehicleClassification = await VehicleClassification.findById(
        req.params.classificationId
    ).distinct('name');
    if (!vehicleClassification) {
        return next(new AppError(`THERE IS AN ERROR`));
    }

    await Service.updateMany(
        { 'prices.vehicleClassification': vehicleClassification[0] }, // Filter criteria to match documents with 'VAN' in prices array
        {
            $set: {
                'prices.$[elem].vehicleClassification': req.body.name,
            },
        },
        {
            arrayFilters: [
                { 'elem.vehicleClassification': vehicleClassification[0] },
            ],
            new: true, // Return the modified document
            runValidators: true, // Run validators on the update operation
        } // Array filter to specify the condition inside the array
    );
    // for (service of services) {
    //     await Service.findByIdAndUpdate();
    // }

    // await Service.updateMany(
    //     {
    //         'prices.vehicleClassification': req.body.name,
    //     },
    //     { $set: { 'prices.vehicleClassification': req.body.name } }
    // );
    return next();
});
exports.updateClassification = catchAsync(async (req, res, next) => {
    const classification = await VehicleClassification.findByIdAndUpdate(
        req.params.classificationId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!classification) {
        return next(new AppError('No classification found with that id', 404));
    }
    await classification.save();
    res.status(200).json({
        status: 'Success',
        data: {
            vehicleClassification: classification,
        },
    });
});

exports.deleteServiceWithVehicleClass = async (req, res, next) => {
    console.log('ERROR IS HERE');
    const classification = await VehicleClassification.findById(
        req.params.classificationId
    );
    if (!classification) {
        return next(new AppError('No classification found with that id', 404));
    }
    await Service.updateMany(
        {
            'prices.vehicleClassification': classification.name,
        },
        {
            $pull: { prices: { vehicleClassification: classification.name } },
        },
        {
            new: true,
            runValidators: false,
        }
    );
    return next();
};

exports.deleteClassification = catchAsync(async (req, res, next) => {
    const classification = await VehicleClassification.findById(
        req.params.classificationId
    );

    if (!classification) {
        return next(new AppError('No classification found with that id', 404));
    }
    await classification.deleteOne();
    // delete from the services

    res.status(204).json({
        status: 'Success',
        data: null,
    });
});
