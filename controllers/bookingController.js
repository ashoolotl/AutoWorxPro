const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Service = require('../models/servicesModel');
const ServiceAvailed = require('../models/serviceAvailedModel');
const Subscription = require('../models/subscriptionModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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
        const newBooking = await Booking.create({
            tokensAmount: 1,
            owner: owner,
            product: cart.product,
            classification: cart.classification,
            plateNumber: cart.plateNumber,
        });

        await generateTokenForUser(newBooking._id);
        console.log('created 1');
    }
};

const generateTokenForUser = async (newBookingId) => {
    const subscriptions = await Subscription.find();
    const services = await Service.find();
    const booking = await Booking.findById(newBookingId);

    const serviceExists = services.some(
        (service) => service.name === booking.product
    );
    const subscriptionExists = subscriptions.some(
        (subscription) => subscription.name === booking.product
    );
    if (serviceExists) {
        await ServiceAvailed.create({
            tokensAmount: booking.tokensAmount,
            owner: booking.owner,
            plateNumber: booking.plateNumber,
            product: booking.product,
            bookingId: booking._id,
        });
    }

    if (subscriptionExists) {
        // generate token
    }
};

const deleteItemsInCart = async (session) => {
    const owner = session.client_reference_id;
    await Cart.deleteMany({ owner: owner });
};
exports.webhookCheckout = catchAsync(async (req, res, next) => {
    console.log('INSIDE WEBHOOK CHECKOUT');

    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        console.log('CREATING BOOKING');
        // create a booking for the admin
        createBookingCheckout(event.data.object);
        // generate the tokens
        //   generateTokenForUser(event.data.object);
        // clear the cart of user
        deleteItemsInCart(event.data.object);
    }
    console.log('FINISHED');

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
