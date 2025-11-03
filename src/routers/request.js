const requestRouter = require('express').Router();
const { userAuth } = require('../middleware/auth');

requestRouter.post("/send", userAuth, async (req, res) => {
    try {
        const user = req.user
        // Here, you can handle the request logic, e.g., saving the request to the database
        res.send(`Request received from user: ${user.emailId}`)
    } catch (err) {
        res.status(400).send("Error " + err.message)
    }
})

module.exports = requestRouter;
