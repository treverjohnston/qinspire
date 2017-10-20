var  models = require('../config/constants').models
let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.ObjectId

var schema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	created: { type: Number, default: Date.now() },
	url: {type: String},
	// Relations
	creatorId: { type: ObjectId, ref: models.user.name, required: true },
	vaults: {type: Array},
	views: {type: Number, default: 0}
});

module.exports = mongoose.model(models.keep.name, schema);