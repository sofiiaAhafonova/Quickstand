var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        maxlength: [100, "too Long"],
        minlength: [1, "too Short"],
        match: [/^[a-zA-Z0-9\s]*$/, "name incorrect"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    team: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    tasks: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    }
});

mongoosePages.skip(listSchema);
module.exports = mongoose.model('List', listSchema);