const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");


router.route("/").get(protect, allUsers);
router.route("/register").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
