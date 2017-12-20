var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        maxlength: [32, "too Long"],
        minlength: [3, "too Short"],
        match: [/^[a-zA-Z\s]*$/, "name incorrect"],
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
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }
});

mongoosePages.skip(taskSchema);
module.exports = mongoose.model('Task', taskSchema);