const mongoose = require("mongoose");

const mixMatchProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    inputImageUrl: String,
    outputImageUrl: String,
    regionalStyleId: { type: mongoose.Schema.Types.ObjectId, ref: "RegionalLibrary" },
    wallColorId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintColor" },
    roofColorId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintColor" },
    columnColorId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintColor" },
    customNotes: String,
    promptUsed: String,
    status: { type: String, default: "pending", maxlength: 50 },
    completedAt: Date,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("MixMatchProject", mixMatchProjectSchema);
