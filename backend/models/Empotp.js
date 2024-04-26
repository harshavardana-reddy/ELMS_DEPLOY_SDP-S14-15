const mongoose = require('mongoose');

const empotpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 120, 
    },
});

const empotp = mongoose.model('EmployeeOTP', empotpSchema);
module.exports = empotp;
