const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
require("dotenv").config();
require("./dbConnector")();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.get("/", (req, res, next) => {
	return res.send({
		message: "Wecome to failure strories api",
		status: "running",
	});
});
app.use((req, res, next) => {
	res.send({
		error: {
			status: 404,
			message: "Invalid route",
		},
	});
});

app.use((err, req, res, next) => {
	res.send({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
});
app.listen(PORT, () => console.log("Server is running on port " + PORT));
