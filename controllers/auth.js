const { User } = require("../models/user");
const { comparePasword, hashPasword } = require("./helper/hashPassword");

const signUp = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).send({ message: `User with provided email ${email} already exist` });
		}
		const hashedPassword = await hashPasword(password);
		user = new User({
			name,
			email,
			password: hashedPassword,
		});
		await user.save();
		const token = user.genarateAuthToken();
		res.send({ token });
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send({ message: `User with provided email ${email} not exists` });
		}
		const isMatch = await comparePasword(password, user.password);
		if (!isMatch) {
			return res.status(404).send({ message: `Invalid email or password` });
		}

		const token = user.genarateAuthToken();
		res.send({ token });
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};

module.exports = {
	login,
	signUp,
};
