const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");
//@route GET api/auth
//@desc Test route
//@access Public
router.get("/", authMiddleware, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
