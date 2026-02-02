const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetuserid) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetuserid].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetuserid }) => {
      const roomId = getSecretRoomId(userId, targetuserid);
      socket.join(roomId);
      console.log("User joined room:", roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstname, lastname, userId, targetuserid, text, profileImage }) => {
        try {
          const roomId = getSecretRoomId(userId, targetuserid);

          let chat = await Chat.findOne({
            partcipants: { $all: [userId, targetuserid] },
          });

          if (!chat) {
            chat = new Chat({
              partcipants: [userId, targetuserid],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // ✅ SEND COMPLETE MESSAGE OBJECT
          io.to(roomId).emit("messageReceiveived", {
            senderId: userId,
            firstname,
            lastname,
            text,
            profileImage,
          });
        } catch (err) {
          console.error("Socket message error:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};

module.exports = initializeSocket;
