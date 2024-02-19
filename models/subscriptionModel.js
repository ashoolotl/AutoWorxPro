const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A subscription must have a name.'],
        unique: true,
        minLength: 2,
        maxLength: 40,
    },
    prices: [
        {
            service: {
                type: String,
                required: [true, 'Please input a service'],
                uppercase: true,
            },
            price: {
                type: Number,
                required: [true, 'A subscription must have a price.'],
            },
            tokensAmount: {
                type: Number,
                required: [
                    true,
                    'Please input number of tokens for this subscription',
                ],
            },
        },
    ],
    description: {
        type: String,
    },
});
// validate if the service selected is in the service database
subscriptionSchema.pre('validate', async function (next) {
    console.log('inside first validation');

    next();
});
// validate if the service is not duplicated inside the function
subscriptionSchema.pre('validate', async function (next) {
    console.log('inside second validation');
    const services = new Set();
    for (price of this.prices) {
        if (services.has(price.service)) {
            console.log(price.service);
            return next(
                new AppError(
                    `There is already a ${price.service} in this subscription. Please choose another service to add in this subscription`,
                    400
                )
            );
        }
        services.add(price.service);
    }
    console.log(services);
    next();
});

// custom middleware to avoid duplicate on services lets say 'Express Wash' and another 'Express Wash'
subscriptionSchema.pre('save', function (next) {
    const descriptionList = [];
    for (price of this.prices) {
        let description = `${price.tokensAmount} ${price.service}`;
        descriptionList.push(description);
    }
    this.description = descriptionList.join(', ');
    next();
});
// populate the description based on the given input of the user
// subscriptionSchema.post('save', async function (docs, next) {
//     console.log('inside post save');
//     const descriptionList = [];
//     console.log(docs.prices);
//     for (doc of docs.prices) {
//         let description = `${doc.tokensAmount} ${doc.service}`;
//         descriptionList.push(description);
//     }
//     docs.description = descriptionList.join(', ');
//     await docs.save();
//     next();
// });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
