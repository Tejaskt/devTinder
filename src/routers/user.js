const userRouter = require('express').Router()
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const user = require('../models/user')
const mongoose = require('mongoose')

// get the pending connection requests for the logged in user
userRouter.get("/requests/received",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender photoUrl") // populate fromUserId with user details

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
        }).populate("fromUserId toUserId", "firstName lastName age gender photoUrl")

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
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = Math.min(limit, 50)
        const skip = (page - 1) * limit

        // get all connection ids where loggedInUser is either fromUserId or toUserId
        const statuses = ["ignore", "interested", "accepted", "rejected"]

        const fromPromises = statuses.map(status =>
            ConnectionRequest.find({ fromUserId: loggedInUser._id, status }).distinct("toUserId")
        )
        const toPromises = statuses.map(status =>
            ConnectionRequest.find({ toUserId: loggedInUser._id, status }).distinct("fromUserId")
        )
        
        const results = await Promise.all([...fromPromises, ...toPromises])
        const flatIds = results.flat().filter(Boolean).map(id => String(id))

        // always exclude the logged in user
        flatIds.push(String(loggedInUser._id))

        // unique, only valid ObjectId strings, then construct ObjectId instances with `new`
        const uniqueValidIds = [...new Set(flatIds)].filter(id => mongoose.Types.ObjectId.isValid(id))
        const allConnectedUsers = uniqueValidIds.map(id => new mongoose.Types.ObjectId(id))

        const users = await user.find({
            _id: { $nin: allConnectedUsers }
        }).select("firstName lastName age photoUrl about skills").skip(skip).limit(limit)

        res.send(users)
    }catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }   
})


module.exports = userRouter
