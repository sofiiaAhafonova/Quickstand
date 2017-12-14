var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');
var projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        maxlength: [32, "tooLong"],
        minlength: [3, "tooShort"],
        match: [/^[a-zA-Z\s]*$/, "name incorrect"],
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
        required: [true, "status required"]
    },
    access: {
        default: "Public",
        type: String,
        required: [true, "access required"],
        enum: ['Public', 'Private']
    },
    team: {
        type: String,
        required: [true, "team required"],
        maxlength: [32, "tooLong"],
        minlength: [3, "tooShort"],
        match: [/^[a-z0-9]+$/, "team incorrect"]
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
        match: [/^[1-5][.][0-9]$/, "Rating incorrect"],
        required: false
    },
    start_date: {
        type: String,
        required: [true, "Start date required"]
    },
    finish_date: {
        type: String,
        required: false
    },
    image: {
        type: String,
        default:  "http://res.cloudinary.com/de46jchnd/image/upload/v1512629286/default-placeholder-project_x3gi0l.png"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    }
});
mongoosePages.skip(projectSchema);

module.exports = mongoose.model('Project', projectSchema);