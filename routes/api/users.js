const express = require("express");
const router = express.Router();
// @route  GET/users
// @desc   Test Route
// @access public
router.get("/", (req, res) => res.send("Users route"));

module.exports = router;
