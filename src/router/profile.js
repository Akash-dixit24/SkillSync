const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../Utils/validation");

profileRoute.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user; 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user); // Send user data in JSON format
    } catch (err) {
        res.status(500).json({ message: "Error while fetching profile", error: err.message });
    }
});

profileRoute.patch("/profile/update", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update user profile fields based on request body
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        // Save the updated user
        await loggedInUser.save();

        res.status(200).json({
            message: `${loggedInUser.firstName}, your profile was updated successfully.`,
            user: loggedInUser, // Send updated user data back
        });
    } catch (err) {
        res.status(500).json({ message: "Error while updating profile", error: err.message });
        console.error(err); // Log the error for debugging
    }
});

module.exports = profileRoute;
