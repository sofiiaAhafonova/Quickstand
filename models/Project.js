var mongoose = require('mongoose');
// Создаем новую схему!
var projectSchema = new mongoose.Schema({
    properties: {
        name: {
            type:String, 
            required:[true,"nameRequired"],
            maxlength:[32,"tooLong"],
            minlength:[3,"tooShort"],
            match:[/^[a-z0-9]+$/,"nameIncorrect"],
            unique:true
        },
        description: {
            type:String, 
            required:false
        },
        status: {
            default: "Finished",
            type:String, 
            required:[true,"statusRequired"]
		},
		team: {
            type:String, 
            required:[true,"nameRequired"],
            maxlength:[32,"tooLong"],
            minlength:[3,"tooShort"],
            match:[/^[a-z0-9]+$/,"teamIncorrect"],
            unique:true
		},
		man_hour: {
            min: 1,
            default: 1,
            type:Number, 
            required: true
		},	
        rating: {
            type:String, 
            min: "1.0",
            default: "1.0",
            match:[ /^[1-5][.][0-9]$/,"ratingIncorrect"],
            required: true
        },
        start_date:{ 
            type : Date, 
            default: Date.now ,
            required: true
		},
		finish_date: {
            type : Date, 
            default: Date.now ,
            required: true
        },
        image: {
            type: Buffer,
            get: binary => Buffer.from(binary).toString('base64'),
            required: false
          }
		
		
    }
});


module.exports = mongoose.model('Project',projectSchema);