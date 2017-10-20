var  models = require('../config/constants').models
let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.ObjectId

var schema = new mongoose.Schema({
	description: { type: String, required: true },
	created: { type: Number, default: Date.now() },
	// Relations
    keepId: { type: ObjectId, ref: models.keep.name, required: true }
});

module.exports = mongoose.model(models.task.name, schema);