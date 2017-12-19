var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        maxlength: [32, "too Long"],
        minlength: [1, "too Short"],
        match: [/^[a-zA-Z0-9\s]*$/, "name incorrect"],
    },
    description: {
        type: String,
        required: false
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
    tasks: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    },
    lists: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List'
        }]
    }
});

mongoosePages.skip(boardSchema);
module.exports = mongoose.model('Board', boardSchema);