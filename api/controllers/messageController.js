const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  console.log("content: ", content);

  if (!content || !chatId) {
    return res.status(400).json({ message: "field missing" });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  let message = await Message.create(newMessage);

  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  await Chat.findByIdAndUpdate(req.body.chatId, { letestMessage: message });

  res.json(message);
});

const fetchMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Invalid chatId" });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (err) {
    console.log("fetching message error:", err);
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = { sendMessage, fetchMessages };
