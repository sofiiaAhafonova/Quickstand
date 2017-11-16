const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
require('mongoose-type-email');
var Project = require('./Project');
let userSch = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 60,
        unique: true,
        required: true
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

userSch.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

const User = mongoose.model('User', userSch);

module.exports = User;