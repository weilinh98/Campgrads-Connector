const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
//@route POST api/users
//@desc Register user
//@access Public
router.post(
  "/",
  [
    //want it to be there and not empty
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists//return true if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }
      // Get user gravatar//this runs when user is not found//pass user's email into and give out an url
      const avatar = await gravatar.url(email, {
        s: "200",
        r: "pg", //rating
        d: "mm" //default gives a default image//404 file not found
      });

      user = new User({
        name,
        email,
        avatar,
        password
      }); //create a new instance of user// need to call user.save to save to the database

      // Encrypt password

      const salt = await bcrypt.genSalt(10); //10 is the rounds//the more this more secure
      user.password = await bcrypt.hash(password, salt);
      //anything that returns a promise we make sure to put await before
      await user.save();
      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id //don't have to do _id which is displayed in the mondodb database, moogoose take care of that
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token }); //send that token back and send to correct route
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
