const mongoose = require("mongoose");

const generationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inputDesc: String,
    inputImageUrl: { type: String, maxlength: 500 },
    outputImageUrl: { type: String, maxlength: 500 },
    style: { type: String, maxlength: 200 },
    palette: { type: String, maxlength: 200 },
    seed: Number,
    promptUsed: String,
    description: String,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Generation", generationSchema);
