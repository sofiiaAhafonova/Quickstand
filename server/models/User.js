const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var mongoosePages = require('mongoose-pages');
const Schema = mongoose.Schema;
require('mongoose-type-email');
var Project = require('./Project');
let userSch = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        unique: true,
        required: true,
        pattern : "^[a-zA-Z\s]*$"
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 100,
        required: true,
        set: password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    projects: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }]
    }
});

userSch.methods.comparePassword = function (password, callback) {
    return  bcrypt.compare(password, this.password, callback);
};

mongoosePages.skip(userSch);
const User = mongoose.model('User', userSch);

module.exports = User;