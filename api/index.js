const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/connectDB");
const colors = require("colors");
const path = require("path");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoute");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

//DB connection
(async () => {
  await connectDB(process.env.MONGO_URL);
})();

//middlewares
app.use(express.json());
app.use(cors());

//----------------------------Deployment--------------------------

const __dirname1 = path.resolve(__dirname);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Backend is working absolutely fine....");
  });
}
//----------------------------Deployment----------------------------

const server = app.listen(PORT, () => {
  console.log(`Backend started on ${PORT}!!`.yellow);
});

//Socket configurarions
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log(socket.rooms);

  socket.on("setup", (userData) => {
    // console.log("user connected");
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User joined room: ", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      //we dont want to send message to ourself
      if (user._id == newMessageReceived.sender._id) {
        return;
      }

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });

  // socket.off("setup", () => {
  //   console.log("user disconnected!!");
  //   socket.leave(roomId);
  // });
});

//routes
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

//Error handling middleware
app.use(notFound);
app.use(errorHandler);
