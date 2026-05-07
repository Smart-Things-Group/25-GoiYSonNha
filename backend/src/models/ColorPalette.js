const mongoose = require("mongoose");

const colorPaletteSchema = new mongoose.Schema(
  {
    colorName: { type: String, maxlength: 100 },
    hexCode: { type: String, maxlength: 7 },
    brand: { type: String, maxlength: 100 },
    category: { type: String, maxlength: 50 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ColorPalette", colorPaletteSchema);
