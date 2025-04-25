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
        // Validate the incoming data
        const errors = validateProfileEditData(req);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const loggedInUser = req.user;

        // Check if the emailId is being updated and if so, validate it
        if (req.body.emailId && req.body.emailId !== loggedInUser.emailId) {
            const existingUser = await mongoose.models.User.findOne({ emailId: req.body.emailId });
            if (existingUser) {
                throw new Error('Email ID is already in use.');
            }
        }

        // Update the fields
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        // Save the updated user
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile is updated`,
            data: loggedInUser,
        });

    } catch (err) {
        res.status(500).json({
            message: "Error while updating profile",
            error: err.message,
        });
        console.error(err); 
    }
});

module.exports = profileRoute;
