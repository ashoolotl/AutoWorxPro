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

exports.validateVehicleClassificationData = catchAsync(
    async (req, res, next) => {
        console.log('INSIDE VEHICLE CLASS VALIDATION');
        const { name } = req.body;
        const method = req.method;
        if (method === 'POST') {
            return next();
        }

        const vehicleClassification = VehicleClassification.findById(
            req.params.classificationId
        );
        if (!vehicleClassification) {
            return next(
                new AppError(
                    `There is no vehicle classification found with that id`
                )
            );
        }
        const allVehicleClassification =
            await VehicleClassification.find().distinct('name');
        console.log(allVehicleClassification);
        const vehicleClassificationSet = new Set(allVehicleClassification);
        console.log(vehicleClassificationSet);
        let nameUpperCase = name.toUpperCase();
        if (vehicleClassificationSet.has(nameUpperCase)) {
            return next(
                new AppError(
                    `The ${nameUpperCase} vehicle classification is already registered. Please create another one.`
                )
            );
        }

        next();
    }
);

exports.updateServiceWithVehicleClass = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE SERVICE WITH CLASS');
    const vehicleClassification = await VehicleClassification.findById(
        req.params.classificationId
    ).distinct('name');
    if (!vehicleClassification) {
        return next(new AppError('No classification found with that id', 404));
    }

    await Service.updateMany(
        { 'prices.vehicleClassification': vehicleClassification[0] },
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
    next();
});

exports.deleteServiceWithVehicleClass = async (req, res, next) => {
    console.log('DELETION OF SERVICE WITH VEHICLE CLASS IS HERE');
    const classification = await VehicleClassification.findById(
        req.params.classificationId
    );
    if (!classification) {
        return next(new AppError('No classification found with that id', 404));
    }

    const servicesToUpdate = await Service.find({
        'prices.vehicleClassification': classification.name,
    });

    for (const service of servicesToUpdate) {
        // If the service has only one price remaining and it matches the classification to delete, delete the service
        if (
            service.prices.length === 1 &&
            service.prices[0].vehicleClassification === classification.name
        ) {
            await Service.findByIdAndDelete(service._id);
        } else {
            await Service.updateMany(
                {
                    'prices.vehicleClassification': classification.name,
                },
                {
                    $pull: {
                        prices: { vehicleClassification: classification.name },
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

    // before we pull let us check if the length is one
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
