const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/connectDB");
const colors = require("colors");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
//DB connection
(async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Backend started on ${port}!!`.yellow);
  });
})();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Backend is working absolutely fine....");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

//Error handling middleware
app.use(notFound);
app.use(errorHandler);
