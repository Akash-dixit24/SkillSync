const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender about skills photo"


userRouter.get("/user/requests/received" , userAuth , async(req , res) => {
       try{
              const loggedInUser = req.user;
              const connectionRequest = await ConnectionRequest.find({
                     toUserId : loggedInUser._id,
                     status : "interested",
              }).populate("fromUserId" , USER_SAFE_DATA) ;
              // .populate("fromUserId" , ["firstName" , "lastName"]) ;
              res.json({message: "Data fetch Sucessfully" , data:connectionRequest})
       }
       catch(err){
              res.status(400).send("Error :" + err.message)
              console.log(err)
       }
})

userRouter.get("/user/connections" , userAuth , async(req , res) =>{
       try{
              const loggedInUser = req.user;
              const connectionRequest = await ConnectionRequest.find({
                     $or : [
                            {toUserId : loggedInUser._id ,status : "accepted"},
                            {fromUserId :loggedInUser._id , status: "accepted"}
                     ]
              }).populate("fromUserId" , USER_SAFE_DATA)
              .populate("toUserId" , USER_SAFE_DATA);
              const data = connectionRequest.map((row) =>{
                     if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                           return row.toUserId
                     }
                    return row.fromUserId
              });
              res.send(data);

       }catch(err){
              res.status(400).send({message: err.message})
       }
})





module.exports = userRouter;