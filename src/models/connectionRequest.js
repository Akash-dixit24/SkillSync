const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "From user ID is required"],
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "To user ID is required"],
      ref: "User",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: "{VALUE} is an incorrect status type",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({fromUserId : 1 , toUserId :1});

connectionRequestSchema.pre("save" , function (next) {
  const connectionRequest = this;
  //if the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("connot send the connection request to yourself !!!");
    
  }
  next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
