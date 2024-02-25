const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const { handleDuplicatesPlugin } = require('../utils/plugins');

const pricesArrayValidator = function (value) {
    return value.length > 0;
};

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A subscription must have a name.'],
        unique: true,
        minLength: 2,
        maxLength: 40,
        uppercase: true,
    },
    prices: {
        type: [
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
        validate: [
            pricesArrayValidator,
            'At least one price for this subscription must be provided.',
        ],
    },
    description: {
        type: String,
    },
    duration: {
        type: String,
        default: 'By Appointment',
    },
});

// generate the description based on the data provided
subscriptionSchema.pre('save', function (next) {
    const descriptionList = [];
    for (price of this.prices) {
        let description = `${price.tokensAmount} ${price.service}`;
        descriptionList.push(description);
    }
    this.description = descriptionList.join(', ');
    next();
});

subscriptionSchema.pre('findOneAndUpdate', async function (next) {
    // this middleware will run when findbyidandupdate is trigerred. It will check if the documents that we want to update contains duplicates
    // if it contain duplicates throw an error
    if (!this._update.prices) {
        next();
    }
    const classifications = new Set();
    for (price of this._update.prices) {
        if (classifications.has(price.service)) {
            return next(
                new AppError(
                    `${price.service} is already in this subscription. Please choose another service to add in this subscription`
                )
            );
        }

        classifications.add(price.service);
    }
    console.log('INSIDE SUBSC SCHEMA MODEL');
    console.log(this._update.prices);
    const descriptions = this._update.prices.map(
        (price) => `${price.tokensAmount} ${price.service}`
    );
    this._update.description = descriptions.join(', ');
});
// custom plugin to avoid duplicate on services lets say 'Express Wash' and another 'Express Wash'
subscriptionSchema.plugin(handleDuplicatesPlugin);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
