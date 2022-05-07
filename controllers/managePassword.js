const { Password } = require("../models/password");
const { User } = require("../models/user");
const Encrypter = require("./helper/endecrption");
const crypto = require("crypto");
const addNewPassword = async (req, res, next) => {
	if (!req.user) return res.status(400).send({ message: "User not authorization" });
	try {
		const { name, username, password, url, notes } = req.body;
		const user = await User.findById(req.user._id);
		if (!user) return res.status(403).send({ message: "User not authorized" });
		let encryptedText;
		if (user.encpSecret) {
			const encrypter = new Encrypter(user.encpSecret);
			encryptedText = encrypter.encrypt(password);
		} else {
			const key = crypto.randomBytes(64).toString("hex");
			user.encpSecret = key;
			await user.save();
			const encrypter = new Encrypter(key);
			encryptedText = encrypter.encrypt(password);
		}

		const newP = new Password({
			passwordName: name,
			username,
			encPassword: encryptedText,
			url,
			notes,
			createdBy: req.user._id,
		});
		await newP.save();
		res.send({});
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};
const updatePassword = async (req, res, next) => {
	if (!req.user) return res.status(400).send({ message: "User not authorization" });

	try {
		const { username, password, url, notes, name } = req.body;
		const { id } = req.params;
		const user = await User.findById(req.user._id);
		if (!user) return res.status(403).send({ message: "User not authorized" });
		let encryptedText;
		if (user.encpSecret) {
			const encrypter = new Encrypter(user.encpSecret);
			encryptedText = encrypter.encrypt(password);
		} else {
			const key = crypto.randomBytes(64).toString("hex");
			user.encpSecret = key;
			await user.save();
			const encrypter = new Encrypter(key);
			encryptedText = encrypter.encrypt(password);
		}
		const foundIdP = await Password.findById(id);
		if (!foundIdP) return res.status(404).send({ message: "Password not found" });
		if (`${foundIdP.createdBy}` !== `${req.user._id}`) return res.status(403).send({ message: "Not permited" });
		const fPass = await Password.findByIdAndUpdate(id, {
			passwordName: name,
			username,
			encPassword: encryptedText,
			url,
			notes,
		});
		res.send({});
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};

const getuserPasswords = async (req, res, next) => {
	if (!req.user) return res.status(400).send({ message: "User not authorization" });
	try {
		const passwords = await Password.find({ createdBy: req.user._id });
		res.send(passwords);
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};
const getuserPasswordByPasswordId = async (req, res, next) => {
	if (!req.user) return res.status(400).send({ message: "User not authorization" });
	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(403).send({ message: "User not authorized" });
		const { id } = req.params;
		const password = await Password.findById(id);
		if (!password) return res.status(404).send({ message: "invalid password id" });
		const encrypter = new Encrypter(user.encpSecret);
		const dencrypted = encrypter.dencrypt(password.encPassword);
		res.send({ password: dencrypted });
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};
const deletePassword = async (req, res, next) => {
	if (!req.user) return res.status(400).send({ message: "User not authorization" });
	try {
		const { id } = req.params;
		const password = await Password.findByIdAndDelete(id);
		res.status(204).send();
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};

module.exports = {
	getuserPasswordByPasswordId,
	addNewPassword,
	updatePassword,
	getuserPasswords,
	deletePassword,
};
