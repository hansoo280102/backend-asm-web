const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const router = express.Router();

//register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, password, username });
    // console.log(user);
    await user.save();
    res
      .status(200)
      .send({ message: "User registered successfully", user: user });
  } catch (error) {
    console.log("Failed to register", error);
    res.status(500).send({ message: "Registration Error" });
  }
});

//login an existing user
router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);

    if (!user) {
      return res.status(404).send({
        message: "Invalid email or password!Please check your login again",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid email or password!Please check your login again",
      });
    }

    //generate and send a JWT token
    const token = await generateToken(user._id);

    res.status(200).send({
      message: "Login Successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Failed to login", error);
    res.status(500).send({ message: "Login Failed! Try again" });
  }
});

module.exports = router;
