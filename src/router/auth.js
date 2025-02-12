const express = require("express");
const { validatioSignUpData } = require("../Utils/validation");
const User = require("../models/user");
const authRoute = express.Router();
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken")


//creating the signup API
authRoute.post("/signup", async (req, res) => {
       try {
           //validation of data
           validatioSignUpData(req);
   
           const { firstName, lastName, emailId, password } = req.body;
   
           //Encrypt the Password
           const passwordHash = await bcrypt.hash(password, 10);
   
           const user = new User({ firstName, lastName, emailId, password: passwordHash });
   
           //creating the new instance of user data
           await user.save();
           res.status(201).json({ message: "User added successfully." });
       } catch (err) {
           res.status(400).json({ error: "Error saving user.", details: err.message });
   
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


module.exports = authRoute;