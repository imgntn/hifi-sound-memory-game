var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
	highscore:Number,
	createdAt: {
		type: Date,
		default: Date.now
	},
	createdBy: String
})

module.exports = mongoose.model('Score', ScoreSchema);	



	