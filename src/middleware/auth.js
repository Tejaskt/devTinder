const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        const decoded = await jwt.verify(token, "Tejaskt");
        
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send("Unauthorized: User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send("Unauthorized: " + err.message);
    }   
}

module.exports = { userAuth }
