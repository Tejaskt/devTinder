const requestRouter = require('express').Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest =  require('../models/connectionRequest')
const User = require('../models/user');


requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {   
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
       
        // check the status allowed or not it should be interested, ignored 
        const allowedStatus = ["ignored","interested"]
        if(!allowedStatus.includes(status.toLowerCase())){
            return res.status(400).send("Invalid status value: " + status)
        }

        // check if existing request from same user to same user
        const existingRequest = await ConnectionRequest.findOne({ 
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })  

        if (existingRequest) {
            return res.status(400).send("Connection request already exists")
        }

        // check if the user is present or not 
        const toUser = await User.findById(toUserId)
        
        if(!toUser){
            return res.status(404).send("The user you are trying to connect with does not exist.")
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
            message: "Connection request sent successfully", 
            data
        })
    } catch (err) {
        res.status(400).send("Error " + err.message)
    }
})


module.exports = requestRouter;
