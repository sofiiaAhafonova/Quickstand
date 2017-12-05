const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let imageSch = new Schema({
    data: {
        type: Buffer
    },
    name: {
        type: String
    }
});

const Image = mongoose.model('Image', imageSch);

module.exports = Image;