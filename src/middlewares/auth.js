const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req , res , next)=>{
       try{
              const {token} = req.cookies;
              if(!token){
                    return res.status(401).send("Please login")
              }
              const decodedobj = await jwt.verify(token , "DEV@TINDER$790");
              const {_id} = decodedobj;
              

              const user = await User.findById(_id);
              if(!user){
                     throw new Error("user is not found")
              }
              req.user = user;
              next();

       }
       catch(err){
              res.status(400).send("ERROR" +err.message);
       }
     
}


module.exports={
       userAuth,
}