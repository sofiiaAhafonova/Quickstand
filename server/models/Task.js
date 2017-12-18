var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        maxlength: [32, "too Long"],
        minlength: [3, "too Short"],
        match: [/^[a-zA-Z\s]*$/, "name incorrect"],
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    user: {
        id: {
             type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            ref: 'User'
        }
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    images: {
        type:[String],
        default:  "http://res.cloudinary.com/de46jchnd/image/upload/v1512629286/default-placeholder-project_x3gi0l.png"
    }
});

mongoosePages.skip(taskSchema);
module.exports = mongoose.model('Task', taskSchema);