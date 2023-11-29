const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  fetchMessages,
} = require("../controllers/messageController");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, fetchMessages);

module.exports = router;
