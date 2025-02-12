const express = require("express");
const profileRoute = express.Router();
const {userAuth} = require("../middlewares/auth");

profileRoute.get("/profile" , userAuth , async (req , res) =>{
       try{
           const user = req.user; 
           res.send(user); 
       }
       catch (err) {
           res.status(500).send("Error during login: " + err.message);
       }
      
   })
   

module.exports = profileRoute;