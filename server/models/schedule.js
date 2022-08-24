// Load required packages
var mongoose = require('mongoose');

// Define Course Schedule schema
var ScheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    startHour: {
        type: Number,
        required: true,
    },
    startMin: {
        type: Number,
        required: true,
    },
    endHour: {
        type: Number,
        required: true,
    },
    endMin: {
        type: Number,
        required: true,
    },
    colorId: {
        type: Number,
        required: true,
    }},
    {versionKey: false}
);

// Export the Mongoose model
module.exports = mongoose.model('Schedule', ScheduleSchema);