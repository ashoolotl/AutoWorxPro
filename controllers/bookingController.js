const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    //req.params.userId

    const cartItems = await Cart.find({ owner: req.user._id });
    console.log(cartItems);
    // console.log(req.user);
    console.log('checkout session');
    let line_items1 = [];
    for (item of cartItems) {
        let newItem = {
            price_data: {
                currency: 'eur',
                unit_amount: item.price * 100,
                product_data: {
                    name: `${item.product}-${item.plateNumber}`,
                    description: item.description,
                },
            },
            quantity: 1,
        };
        line_items1.push(newItem);
    }
    console.log(line_items1);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/dashboard`,
        cancel_url: `${req.protocol}://${req.get('host')}/carts`,
        customer_email: req.user.email,
        client_reference_id: req.params.userId,
        line_items: line_items1,
        mode: 'payment',
    });

    res.status(200).json({
        status: 'success',
        session,
    });
});
const createBookingCheckout = async (session) => {
    // if successful booking create a checkout and clear the items in cart by the user
    const owner = session.client_reference_id;

    const carts = await Cart.find({ owner: owner });

    for (cart of carts) {
        await Booking.create({
            tokensAmount: 1,
            owner: owner,
            product: cart.product,
            classification: cart.classification,
            plateNumber: cart.plateNumber,
        });
    }

    // other wise this would not run :)
};
exports.webhookCheckout = catchAsync(async (req, res, next) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        createBookingCheckout(event.data.object);
    }

    res.status(200).json({
        received: true,
    });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find();
    res.status(200).json({
        status: 'success',
        data: {
            booking: bookings,
        },
    });
});
