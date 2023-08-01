const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const authMiddleware = require("./authMiddleware");
const router = express.Router();

router.post("/signup", cors(), async (req, res) => {
  try {
    const { name, email, password, age, phoneNumber } = req.body;
    const hP = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hP, age, phoneNumber });
    await user.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid login credentials");
    }

    const token = jwt.sign({ _id: user._id.toString() }, "anurag");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.send({ user, token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (tokenObj) => tokenObj.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/logoutAll", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
