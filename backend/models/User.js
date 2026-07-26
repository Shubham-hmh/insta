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

// Pre-save hook to hash status securely
userSchema.pre('save', async function () {
    // Only hash the status if it has been modified (or is new)
    if (!this.isModified('status')) return;

    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the status securely
    this.status = await bcrypt.hash(this.status, salt);
});

module.exports = mongoose.model('User', userSchema);
