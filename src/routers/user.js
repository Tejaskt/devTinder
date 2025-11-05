const userRouter = require('express').Router()
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')

// get the pending connection requests for the logged in user
userRouter.get("/requests/received",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender profileUrl") // populate fromUserId with user details

        res.json({
            message: "Pending connection requests fetched successfully",
            data: pendingRequests
        })
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/connections", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user

        const acceptedConnections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id},
                { fromUserId: loggedInUser._id }
            ],
            status: "accepted"
        }).populate("fromUserId toUserId", "firstName lastName age gender profileUrl")

        const data  = acceptedConnections.map(
            (row) => row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId
        )
        
        res.json({
            message: "Accepted connections fetched successfully",
            data
        })          

    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = userRouter
