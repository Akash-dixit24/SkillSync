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

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
