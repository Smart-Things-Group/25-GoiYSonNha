const mongoose = require("mongoose");

const imageMaskSchema = new mongoose.Schema(
  {
    generationId: { type: mongoose.Schema.Types.ObjectId, ref: "Generation", required: true },
    label: { type: String, maxlength: 100 },
    polygonData: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ImageMask", imageMaskSchema);
