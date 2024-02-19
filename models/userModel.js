const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please input your name."],
    },
    email: {
        type: String,
        required: [true, "Please input email."],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // THIS ONLY WORKS ON .SAVE AND ON .CREATE!!! we also need to use save when updating the document
            validator: function (val) {
                return val === this.password;
            },
            message: "Password do not match",
        },
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
