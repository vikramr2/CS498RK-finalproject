// Load required packages
var mongoose = require('mongoose');

// Define User schema
var UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    savedSchedule: {
        type: [String],
        default: []
    }},
    {versionKey: false}
);

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);