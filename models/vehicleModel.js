const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    classification: {
        type: String,
        required: [true, 'Please input the classification.'],
        uppercase: true,
        unique: true,
    },
    brand: {
        type: String,
        required: [true, 'Please input the brand name.'],
        uppercase: true,
        unique: true,
    },

    photo: {
        type: String,
        default: 'default.png',
    },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
