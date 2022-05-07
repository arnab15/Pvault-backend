const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
	passwordName: {
		type: "string",
		required: true,
	},
	encPassword: {
		type: "string",
		required: true,
	},
	username: {
		type: "string",
		required: true,
	},
	notes: {
		type: "string",
	},
	url: {
		type: "string",
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

exports.Password = mongoose.model("Password", passwordSchema);
