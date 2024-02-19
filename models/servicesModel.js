const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A service must have a name.'],
        unique: true,
        minLength: 2,
        maxLength: 40,
        uppercase: true,
    },
    description: {
        type: String,
        required: [true, 'A service must have a description.'],
        minLength: 2,
        maxLength: 500,
    },
    duration: {
        type: Number,
        required: [true, 'A service must have a duration.'],
    },
    prices: [
        {
            vehicleClassification: {
                type: String,
                required: [true, 'Please input a vehicle classification.'],
                uppercase: true,
            },
            price: {
                type: Number,
                required: ['true', 'A classification must have a price.'],
            },
        },
    ],
});

serviceSchema.methods.checkForDuplicates = async function (pricesArray, next) {
    const classifications = new Set();
    console.log(pricesArray);
    console.log('IM HEREEE');
    for (const price of pricesArray) {
        if (classifications.has(price.vehicleClassification)) {
            return next(
                new AppError(
                    `${price.vehicleClassification} is already in this service. Please choose another vehicle classification`
                )
            );
        }
        classifications.add(price.vehicleClassification);
    }
    next();
};

serviceSchema.pre('save', async function (next) {
    // this will run on save to avoid duplicate vehicle classification on the same service
    await this.checkForDuplicates(this.prices, next);
    next();
});
serviceSchema.pre('findOneAndUpdate', async function (next) {
    // this middleware will run when findbyidandupdate is trigerred. It will check if the documents that we want to update contains duplicates
    // if it contain duplicates throw an error
    const classifications = new Set();
    for (price of this._update.prices) {
        if (classifications.has(price.vehicleClassification)) {
            return next(
                new AppError(
                    `${price.vehicleClassification} is already in this service. Please choose another vehicle classification`
                )
            );
        }
        classifications.add(price.vehicleClassification);
    }
    next();
});
serviceSchema.pre('updateMany', async function (next) {
    // before running update many we need to validate the input
    const filter = this.getFilter()['prices.vehicleClassification'];
    let conditionToUpdate = this.getUpdate();
    if ('$pull' in conditionToUpdate) {
        // If deleting  A VEHICLE CLASSIFICATION do nothing
        next();
    }
    if ('$set' in conditionToUpdate) {
        // IF IT CONTAINS A SET MEANING UPDATE THE VALUES
        conditionToUpdate =
            this.getUpdate()['$set'][
                'prices.$[elem].vehicleClassification'
            ].toUpperCase();

        // check first if the vehicle classification value DOES NOT EXIST
        const services = await Service.find({
            'prices.vehicleClassification': filter,
        }).distinct('prices');
        console.log(services);
        for (service of services) {
            if (service.vehicleClassification == conditionToUpdate) {
                next(
                    new AppError(
                        `${conditionToUpdate} is already a vehicle classification in this service. Please choose another vehicle class`,
                        400
                    )
                );
            }
        }
    }
    next();
});
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
