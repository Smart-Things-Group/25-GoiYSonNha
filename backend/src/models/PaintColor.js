const mongoose = require("mongoose");

const paintColorSchema = new mongoose.Schema(
  {
    colorName: { type: String, maxlength: 200 },
    colorCode: { type: String, maxlength: 50 },
    hexCode: { type: String, maxlength: 7 },
    componentType: { type: String, enum: ["wall", "roof", "column", "all"], maxlength: 50 },
    imageUrl: String,
    description: String,
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintBrand", required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("PaintColor", paintColorSchema);
