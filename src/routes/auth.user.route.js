const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const generateToken = require("../middleware/generateToken");

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
    // console.log("Generate token: ", token);
    res.cookie("token", token, {
      httpOnly: true, // enable cookies
      secure: true,
      sameSite: true,
    });

    res.status(200).send({
      message: "Login Successful",
      token,
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

//logout a user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Failed to log out", error);
    res.status(500).send({ message: "Logout Failed! Try again" });
  }
});

//get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role");
    res.status(200).send({ message: "users found successfully", users });
  } catch (error) {
    console.log("Failed to get users", error);
    res.status(500).send({ message: "Failed to get users" });
  }
});

//delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Failed to delete user", error);
    res.status(500).send({ message: "Failed to delete user" });
  }
});
module.exports = router;
