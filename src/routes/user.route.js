const express = require("express");
require("dotenv").config();
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User already exist. Please Login!!!" });
    }

    const passHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username: username, password: passHash });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({
      message: `${newUser.username} registed Successfully!!!`,

      Token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Can't register please try later!!!", error: error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const passMatch = await user.comparePassword(password);
    if (!passMatch)
      return res.status(400).json({ message: "invalid Credentials" });
    res.status(200).json({ message: `${user.username} login successfull` });
  } catch (error) {
    res.status(500).json({ message: "Server error while Login", error: error });
  }
});

module.exports = router;
