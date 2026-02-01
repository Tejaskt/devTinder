const chatRouter = require("express").Router();
const {Chat} = require("../models/chat");
const { userAuth } = require("../middleware/auth");

chatRouter.get("/chat/:targetuserid", userAuth, async (req, res) => {
    const { targetuserid} = req.params;
    console.log(targetuserid);
    
    const userId = req.user._id;
    try {
        let chat = await Chat.findOne({
            partcipants:{$all:[userId,targetuserid]}
        }).populate({
            path:"messages.senderId",
            select:"firstname lastname",
        })
        if(!chat){
            chat =  new Chat({
                partcipants:[userId,targetuserid],
                messages:[],
            });
            await chat.save();
        }
        res.json(chat)
    }
    catch (err) {
        console.log(err);

    }
})


module.exports = chatRouter