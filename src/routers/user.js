const userRouter = require('express').Router()
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const user = require('../models/user')

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

userRouter.get("/feed", userAuth, async (req,res)=>{
    try {

        // feed api to get all users except logged in user and users already connected or requested or ignored
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = Math.min(limit, 50) // max limit is 50
        const skip = (page - 1) * limit

        const ignoredUsers = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "ignore"
        }).distinct("toUserId")

        const requestedUsers = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "interested"
        }).distinct("toUserId")

        const acceptedUsers = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "accepted"
        }).distinct("toUserId")

        const rejectedUsers = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "rejected"
        }).distinct("toUserId")

        const allConnectedUsers = [...new Set([
            ...ignoredUsers.map(String), 
            ...requestedUsers.map(String), 
            ...acceptedUsers.map(String), 
            ...rejectedUsers.map(String), 
            String(loggedInUser._id)    
        ])]

        const feedUsers = await user.find({
            _id: { $nin: allConnectedUsers }
        }).select("firstName lastName age photoUrl about skills").skip(skip).limit(limit)

        res.json({
            message: "Feed fetched successfully",
            data: feedUsers
        })

    }catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }   
})


module.exports = userRouter
