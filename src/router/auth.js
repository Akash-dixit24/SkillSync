const express = require("express");
const { validateSignUpData } = require("../Utils/validation");
const User = require("../models/user");
const authRoute = express.Router();
const bcrypt = require("bcrypt");



authRoute.post("/signup", async (req, res) => {
    try {
       
        const validationErrors = validateSignUpData(req);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        const { firstName,age,gender, lastName,skills, about , emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName,skills, age,about, gender, emailId, password: passwordHash });
        await user.save();

        res.status(201).json({ message: "User added successfully." });
    } catch (err) {
        res.status(500).json({ error: "Error saving user.", details: err.message });
    }
});

authRoute.post("/login", async (req, res) => {
       try {
           const { emailId, password } = req.body;
           const user = await User.findOne({ emailId });
   
           if (!user) {
               return res.status(401).send("Invalid email or password.");
           } else {
               const isPasswordValid = await user.validatePassword(password);
               if (isPasswordValid) {

                   const token = await user.getJWT();

                   res.cookie("token" ,token)
                   res.status(200).json({message : "Login Sucessfully", user});
                  
               } else {
                   return res.status(401).send("Invalid email or password.");
               }
           }
       } catch (err) {
           res.status(500).send("Error during login: " + err.message);
       }
   });

authRoute.post("/logout" , async(req , res) =>{
    res.cookie("token" , null ,{
        expires : new Date(Date.now()),
    })
    res.send("logout successfully")
})


module.exports = authRoute;