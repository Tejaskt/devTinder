const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getsecrectroomid = (userId, targetuserid) => {
    return crypto.createHash("sha256").update([userId, targetuserid].sort().join("$")).digest("hex")
} // check here names 


const initialzesocket = (server) => {
    const io = socket(server, {
        cors: { origin: "http://localhost:5173" },
    })
    io.on("connection", (socket) => {
        socket.on("joinChat", ({ firstname, userId, targetuserid }) => {
            const roomId = getsecrectroomid(userId, targetuserid)
            console.log(firstname + "joining room" + roomId);

            socket.join(roomId)
        });

        socket.on("sendMessage", async ({ firstname, userId, targetuserid, text }) => {

            try {
                const roomId = getsecrectroomid(userId, targetuserid)
                console.log(firstname + " " + text);
                let chat = await Chat.findOne({
                    partcipants: { $all: [userId, targetuserid] },
                })
                if (!chat) {
                    chat = new Chat({
                        partcipants: [userId, targetuserid],
                        messages: [],
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text,
                });
                await chat.save();
                io.to(roomId).emit("messageReceiveived", { firstname, text })
            }
            catch (err) {
                console.log(err);
            }

        });

        socket.on("disconect", () => {

        });
    });
}

module.exports = initialzesocket