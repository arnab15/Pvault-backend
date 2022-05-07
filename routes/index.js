const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./authRouter");
const passRouter = require("./passRoute");
apiRouter.use("/auth", authRouter);
apiRouter.use(passRouter);
module.exports = apiRouter;
