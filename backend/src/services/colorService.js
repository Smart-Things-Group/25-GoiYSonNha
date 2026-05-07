const ColorPalette = require("../models/ColorPalette");

async function getAllColors() {
  return ColorPalette.find().sort({ brand: 1, colorName: 1 });
}

module.exports = { getAllColors };
