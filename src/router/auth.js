const express = require("express");
const { validateSignUpData } = require("../Utils/validation");
const User = require("../models/user");
const authRoute = express.Router();
const bcrypt = require("bcrypt");


//creating the signup API
// creating the signup API
authRoute.post("/signup", async (req, res) => {
    try {
        // Validate sign-up data
        const validationErrors = validateSignUpData(req);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the Password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user instance
        const user = new User({ firstName, lastName, emailId, password: passwordHash });

        // Save the user data to the database
        await user.save();
        
        // Respond with success message
        res.status(201).json({ message: "User added successfully." });
    } catch (err) {
        res.status(500).json({ error: "Error saving user.", details: err.message });
    }
});

//creation of login API
authRoute.post("/login", async (req, res) => {
       try {
           const { emailId, password } = req.body;
           const user = await User.findOne({ emailId });
   
           if (!user) {
               return res.status(401).send("Invalid email or password.");
           } else {
               const isPasswordValid = await user.validatePassword(password);
               if (isPasswordValid) {
                   //create the JWT token
   
                   const token = await user.getJWT();
   
   
                   //add token to cookies and send response back to user
                   res.cookie("token" ,token)
                   res.status(200).send("User login successful.");
                  
               } else {
                   return res.status(401).send("Invalid email or password.");
               }
           }
       } catch (err) {
           res.status(500).send("Error during login: " + err.message);
       }
   });

//creation of logout API
authRoute.post("/logout" , async(req , res) =>{
    res.cookie("token" , null ,{
        expires : new Date(Date.now()),
    })
    res.send("logout successfully")
})


module.exports = authRoute;