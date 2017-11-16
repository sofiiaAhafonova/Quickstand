var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Required"],
        maxlength: [32, "tooLong"],
        minlength: [3, "tooShort"],
        match: [/^[a-zA-Z\s]*$/, "nameIncorrect"],
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        default: "Finished",
        type: String,
        enum: ['Finished', 'Unfinished'],
        required: [true, "statusRequired"]
    },
    access: {
        default: "Public",
        type: String,
        required: [true, "accessRequired"],
        enum: ['Public', 'Private']
    },
    team: {
        type: String,
        required: [true, "team Required"],
        maxlength: [32, "tooLong"],
        minlength: [3, "tooShort"],
        match: [/^[a-z0-9]+$/, "teamIncorrect"]
    },
    man_hour: {
        min: 1,
        default: 1,
        type: Number,
        required: false
    },
    rating: {
        type: String,
        min: "1.0",
        default: "1.0",
        match: [/^[1-5][.][0-9]$/, "ratingIncorrect"],
        required: false
    },
    start_date: {
        type: String,
        required: [true, "startDateRequired"]
    },
    finish_date: {
        type: String,
        required: false
    },
    image: {
        type: Buffer,
        required: [true, "image Required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Project', projectSchema);