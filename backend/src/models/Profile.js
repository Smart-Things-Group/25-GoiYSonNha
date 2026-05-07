const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    areaSqm: Number,
    houseType: { type: String, maxlength: 100 },
    style: { type: String, maxlength: 200 },
    budget: { type: String, maxlength: 50 },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updatedAt" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Profile", profileSchema);
