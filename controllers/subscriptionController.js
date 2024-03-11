const multer = require('multer');
const sharp = require('sharp');
const Subscription = require('../models/subscriptionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Service = require('../models/servicesModel');

const multerStorage = multer.memoryStorage();
const multerFile = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an image! Please upload only images.', 400),
            false
        );
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFile,
});

exports.uploadSubscriptionPhoto = upload.single('photo');

exports.resizeSubscriptionPhoto = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    req.file.filename = `${req.body.name}.jpeg`;
    sharp(req.file.buffer)
        .resize(3200, 1800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/subscriptions/${req.file.filename}`);

    next();
};
exports.validateSubscriptionData = catchAsync(async (req, res, next) => {
    const { prices, name } = req.body;
    // check here if name is duplicate
    if (req.method === 'PATCH') {
        console.log('HERE');
        const doesSubscriptionExist = await Subscription.findById(
            req.params.subscriptionId
        );
        if (!doesSubscriptionExist) {
            return next(new AppError(`There is no service with that id`, 400));
        }
    }
    if (name) {
        console.log('INSIDE HERE');
        const subscription = await Subscription.find().distinct('name');
        const subscriptionSet = new Set(subscription);
        // check if the name is duplicate
        let subscriptionNameUpperCase = name.toUpperCase();
        if (subscriptionSet.has(subscriptionNameUpperCase)) {
            return next(
                new AppError(
                    `The ${subscriptionNameUpperCase} is already a registered subscription name. Please choose another subscription name.`
                )
            );
        }
    }

    // check here if there is prices
    if (prices) {
        const serviceList = await Service.find().distinct('name');
        const serviceSet = new Set(serviceList);
        for (price of prices) {
            price.service = price.service.toUpperCase();
            if (!serviceSet.has(price.service)) {
                return next(
                    new AppError(
                        `There is no ${price.service} registered as a service. Please use another service`,
                        400
                    )
                );
            }
        }
    }

    // we want to avoid duplicate name on create and on update
    // we also want to avoid duplicate services on update aand on create

    // this would handle cases for both create and update if it is not a service

    // handle duplicate service name

    next();
});
exports.getAllSubscription = catchAsync(async (req, res, next) => {
    const subscriptions = await Subscription.find().select('-__v');
    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        data: {
            subscriptions,
        },
    });
});
exports.createSubscription = catchAsync(async (req, res, next) => {
    let fileName = 'default.png';
    if (req.file) {
        fileName = req.file.filename;
    }
    const subscription = await Subscription.create({
        name: req.body.name,
        photo: fileName,
        prices: req.body.prices,
    });

    res.status(200).json({
        status: 'success',
        results: subscription.length,
        data: {
            subscription,
        },
    });
});

exports.editSubscription = catchAsync(async (req, res, next) => {
    // update here the description

    const subscription = await Subscription.findByIdAndUpdate(
        req.params.subscriptionId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!subscription) {
        return next(new AppError('No subscription found with that id', 400));
    }
    console.log('SAVING THIS SUBSCRIPTION');
    res.status(200).json({
        status: 'success',
        data: {
            subscription,
        },
    });
});

exports.deleteSubscription = catchAsync(async (req, res, next) => {
    const subscription = await Subscription.findByIdAndDelete(
        req.params.subscriptionId
    );
    if (!subscription) {
        return next(new AppError('No subscription found with that id', 400));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
