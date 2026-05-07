const mongoose = require("mongoose");

const designConfigSchema = new mongoose.Schema(
  {
    generationId: { type: mongoose.Schema.Types.ObjectId, ref: "Generation", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    configJson: { type: mongoose.Schema.Types.Mixed },
    isFinal: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updatedAt" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("DesignConfig", designConfigSchema);
