const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: [true, 'The item must have a price'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
