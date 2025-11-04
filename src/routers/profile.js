const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');         



profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)  
        
    } catch (err) {
        res.status(400).send("Error " + err.message)
    }   
})

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const isEditAllowed = validateEditProfileData(req);

        if (!isEditAllowed) {
            return res.status(400).send("Invalid fields in the request.");
        }
    
        Object.keys(req.body).forEach((field) => {
            user[field] = req.body[field];
        });

        await user.save();
        res.send("Profile updated successfully.");
    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
});

profileRouter.patch("/change-password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;

        // Validate the old password and update to the new password
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both old and new passwords are required.");
        }

        // Here you would typically check the old password and update the new password
        if (user.password !== oldPassword) {
            return res.status(400).send("Old password is incorrect.");
        } 
        
        // For demonstration, let's assume the old password is correct
        user.password = newPassword;
        await user.save();
        res.send("Password changed successfully.");
    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
});


module.exports = profileRouter;