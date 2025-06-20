const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const registerRoute = require("./src/routes/user.route");
const loginRoute = require("./src/routes/user.route");

app.use(cors());
app.use(express.json());

app.use("/auth", registerRoute);

app.use("/auth", loginRoute);

module.exports = app;
