const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
