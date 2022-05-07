const JWT = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
	const accessToken = req.headers["authorization"];
	if (!accessToken) return res.status(400).send({ message: "No token provided" });
	const bearerToken = accessToken.split(" ");
	const token = bearerToken[1];
	JWT.verify(token, process.env.JWT_SECREAT, (err, payload) => {
		if (err) {
			const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
			return res.status(401).send({ message });
		}
		req.user = payload;
		next();
	});
};
