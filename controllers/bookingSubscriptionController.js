const catchAsync = require('../utils/catchAsync');
const BookingSubscription = require('../models/bookingSubscriptionModel');
exports.getAllBookingSubscription = catchAsync(async (req, res, next) => {});

exports.updateBookingSubscriptionById = catchAsync(async (req, res, next) => {
    console.log('INSIDE UPDATE BOOKING SUBSCRIPTIONS ID');
    console.log(req.body);
    const updatedBooking = await BookingSubscription.findByIdAndUpdate(
        req.params.subscriptionBookingId,
        {
            scheduledDate: req.body.scheduledDate,
            status: req.body.status,
            chosenService: req.body.chosenService,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    console.log(updatedBooking);
    res.status(200).json({
        status: 'success',
        data: {
            bookingSubscription: updatedBooking,
        },
    });
});
