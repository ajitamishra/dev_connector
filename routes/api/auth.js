const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const User = require("../../models/User");

// @route  GET/auth
// @desc   Test Route
// @access public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // -password -->to hide password in the returned object
    res.json(user);
  } catch (err) {
    Console.log(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
