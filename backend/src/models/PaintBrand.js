const mongoose = require("mongoose");

const paintBrandSchema = new mongoose.Schema(
  {
    brandName: { type: String, maxlength: 100 },
    brandLogoUrl: { type: String, maxlength: 500 },
    description: String,
    websiteUrl: { type: String, maxlength: 500 },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("PaintBrand", paintBrandSchema);
