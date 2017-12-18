var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var boardSchema = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    tasks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }]
    }
});

mongoosePages.skip(boardSchema);
module.exports = mongoose.model('Board', boardSchema);