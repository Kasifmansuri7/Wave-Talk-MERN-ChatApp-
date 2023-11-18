const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(404).json({ message: "userid not found" });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("letestMessage");

  isChat = await User.populate(isChat, {
    path: "letestMessage.sender",
    select: "name avatar email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const creatChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: creatChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (err) {
      console.log("create chat", err);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    var userChat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("letestMessage")
      .sort({ updatedAt: -1 });

    userChat = await User.populate(userChat, {
      path: "letestMessage.sender",
      select: "name avatar email",
    });
    res.send(userChat);
  } catch (err) {
    console.log("fetch chats ", err);
  }
});

//create group chat
const createGroupChat = asyncHandler(async (req, res) => {
  let { users, name } = req.body;
  if (!users || !name) {
    return res.status(401).send({ message: "please fill all fields" });
  }

  users = JSON.parse(users);

  if (users < 2) {
    return res.status(400).send("More than 2 users required to form a group");
  }

  users.push(req.user._id);
  console.log("users: ", users);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    console.log("groupChat: ", groupChat);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    console.log("fullGroupChat: ", fullGroupChat);

    return res.status(201).json(fullGroupChat);
  } catch (err) {
    console.log("Group creation err:", err);
    return res.status(500).send("group chat creation err", err);
  }
});

//Rename the group name
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, name } = req.body;

  //find the group
  try {
    const updatedGroup = await Chat.findOneAndUpdate(
      { _id: chatId, isGroupChat: true },
      { chatName: name },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send(updatedGroup);
  } catch (err) {
    console.log("group rename err", err);
    return res.status(500).send("group rename err:", err);
  }
});

//add member to group

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, newMemberId } = req.body;

  try {
    //check newMember already part of this group or not
    const findChat2 = await Chat.findOne({
      _id: chatId,
      users: { $not: { $elemMatch: { $eq: newMemberId } } },
    });

    if (!findChat2) {
      return res.status(400).send("User is already a part of group");
    }

    const updatedGroup = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: req.user._id,
      },
      { $push: { users: newMemberId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) {
      return res.status(500).send("something went wrong");
    }

    return res.status(200).send(updatedGroup);
  } catch (err) {
    console.log("group add memeber err:", err);
    return res.status(400).send("group add member err", err);
  }
});

//remove member from group
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, removeMemberId } = req.body;

  try {
    const checkGroupAdmin = await Chat.findOne({
      _id: chatId,
      groupAdmin: removeMemberId,
    });

    if (checkGroupAdmin) {
      return res.status(400).send("Admin can't exit the group");
    }

    //remove member
    const updatedGroup = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $pull: { users: removeMemberId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) {
      return res.status(500).send("something went wrong");
    }

    return res.status(200).send(updatedGroup);
  } catch (err) {
    console.log("remove from group err", err);
    return res.status(500).send("remove from group err", err);
  }
});


module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
