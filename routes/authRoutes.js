const express = require("express");
const { User } = require("../mongoose/schemas");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists. Choose a different one.");
      res.redirect("/register");
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      req.flash("success", "User registered successfully.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error registering user.");
    res.redirect("/register");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.username = username;
      res.redirect("/dashboard");
    } else {
      // req.flash('error', 'Invalid username or password.');
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error during login.");
    res.redirect("/login");
  }
});

module.exports = router;
