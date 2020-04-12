const express = require("express");
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const bcrypt = require("bcryptjs");
// @route POST/users
// @desc   Register user
// @access public
router.post(
  "/",
  [
    check("name", "Please enter name").not().isEmpty(),

    check("email", "Please enter valid email").isEmail(),
    check(
      "password",
      "Please enter valid password,it should have minimum of 6 characters."
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body; // this is destructuring....alternative to req.body.name,req.body.email.......
    try {
      //check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists." }] });
      }

      //gravatar

      const avatar = gravatar.url(email, {
        s: "200", //s=size of string  res.send("Users route");
        r: "pg",
        d: "mm", // to get default icon
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encypt the password

      const salt = await bcrypt.genSalt(10); //  with salt we can generate hash ...bcrypt.gensalt(rounds)--> more no. of rounds ,more secured hash
      user.password = await bcrypt.hash(password, salt); //bcrypt.hash()takes 2 parameters one plain text password and other salt which is to be used to hash password
      await user.save(); // saved to database

      // jwt token

      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        async (err, token) => {
          if (err) throw err;
          await res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
