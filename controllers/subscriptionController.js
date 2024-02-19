const Subscription = require('../models/subscriptionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    const subscription = await Subscription.create(req.body);

    res.status(200).json({
        status: 'success',
        results: subscription.length,
        data: {
            subscription,
        },
    });
});
