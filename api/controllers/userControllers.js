const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "field missing" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "user already exists" });
  }

  const user = await User.create({ name, email, password, pic });

  if (user) {
    return res.status(201).json({
      message: "Sign Up success!!",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        pic: user.avatar,
        token: generateToken(user._id),
      },
    });
  } else {
    return res.status(500).json({ message: "something went wrong" });
  }
});

//login the user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      message: "Login success!",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        pic: user.avatar,
        token: generateToken(user._id),
      },
    });
  } else {
    return res.status(400).json({ message: "Invalid email or password!" });
  }
});

//Get all users
const allUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keywords).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
