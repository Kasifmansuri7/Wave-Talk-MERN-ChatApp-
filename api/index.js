const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./models/connectDB");

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Backend is working absolutely fine....");
});

app.get("/chats", (req, res) => {
  res.json({ kashif: "hey message" });
});

//DB connection
(async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Backend started on ${port}!!`);
  });
})();
