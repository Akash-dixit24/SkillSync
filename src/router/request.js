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

    if (![ "ignored", "interested"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already exists." });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();

    const fromUser = await User.findById(fromUserId).select("firstName");
    const toUserName = await User.findById(toUserId).select("firstName");

    res.status(201).json({
      message: `${fromUser.firstName} is ${status} to ${toUserName.firstName}`,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while sending the request.", error: err.message });
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"]; 

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status is not valid" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested", 
      
    });
    
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request not found" })
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ message: "Connection Request is now " + status, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating connection request", error: err.message });
  }
});

module.exports = requestRouter;

