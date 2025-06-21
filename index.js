const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const registerRoute = require("./src/routes/user.route");
const { Server } = require("socket.io");
const http = require("http");
const MessageModel = require("./src/models/Message");
const UserModel = require("./src/models/User");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use("/auth", registerRoute);

//socket io
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;
    const newMessage = new MessageModel({ sender, receiver, message });
    await newMessage.save();

    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.get("/messages", async (req, res) => {
  const { receiver, sender } = req.query;
  try {
    const messages = await MessageModel.find({
      $or: [
        { sender, receiver },
        { serder: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the messages" });
  }
});

app.get("/users", async (req, res) => {
  const { currentUser } = req.query;
  try {
    const users = await UserModel.find({ username: { $ne: currentUser } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the users" });
  }
});

module.exports = server;
