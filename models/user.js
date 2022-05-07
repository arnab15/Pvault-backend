const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: "string",
		required: true,
	},
	email: { type: "string", unique: true, required: true },
	password: { type: "string", required: true },
	encpSecret: {
		type: "string",
	},
});
userSchema.methods.genarateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
		},
		process.env.JWT_SECREAT,
		{ expiresIn: "7 days" }
	);
	return token;
};

exports.User = mongoose.model("User", userSchema);
