// Load required packages
var mongoose = require('mongoose');

// Define Course Historical Results schema
var ResultsSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    courseNumber: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    creditHours: {
        type: Number,
        required: true
    },
    avgGPA: {
        type: Number,
        required : true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    courseTags: {
        type: [String],
        default: []
    }},
    {versionKey: false}
);

// Export the Mongoose model
module.exports = mongoose.model('Results', ResultsSchema);
