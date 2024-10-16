const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["cooking", "shopping", "entertainment"],
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Tags", tagSchema);
