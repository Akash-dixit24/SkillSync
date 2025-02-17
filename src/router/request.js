const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    if (![ "rejected", "interested"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const existingRequest = await ConnectionRequest.findOne({
     $or : [
      {fromUserId ,toUserId},
      {fromUserId : toUserId, toUserId :fromUserId }
     ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already exists." });
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({message: "user not Found "})
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();

    // Fetch the sender user's information for the response
    const fromUserName = await User.findById(fromUserId).select("firstName");
    const toUserName = await User.findById(toUserId).select("firstName");

    res.status(201).json({
      message: `${fromUserName.firstName} is ${status} to ${toUserName.firstName}`,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while sending the request.", error: err.message });
  }
});

module.exports = requestRouter;
