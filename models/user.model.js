
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    }

});

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel };
