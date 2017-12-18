var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        maxlength: [32, "too Long"],
        minlength: [3, "too Short"],
        match: [/^[a-zA-Z\s]*$/, "name incorrect"],
        unique: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    task: {
        type:[ mongoose.Schema.Types.ObjectId],
        ref: 'Task'
    }
});

mongoosePages.skip(listSchema);
module.exports = mongoose.model('List', listSchema);