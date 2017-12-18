var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');



var PostSchema = new Schema({
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
    title   : String
  , date    : Date
});


mongoosePages.skip(PostSchema);
module.exports = mongoose.model('Comment', PostSchema);