const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/group/add").put(protect, addToGroup);
router.route("/group/remove").put(protect, removeFromGroup);
router.route("/group/rename").put(protect, renameGroup);

module.exports = router;
