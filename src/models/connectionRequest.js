const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:{
            values:["ignore","interested","accepeted","rejected"],
            message:`{VALUE} is not a valid status type`
        }
    }
},{ timestamps: true })

// Set compound index on fromUserId and toUserId to ensure uniqueness
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });



//validation for not send the request to user itself
connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send a connection request to yourself.")
    }
    next()
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel