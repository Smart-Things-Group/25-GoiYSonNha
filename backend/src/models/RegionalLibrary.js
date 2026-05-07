const mongoose = require("mongoose");

const regionalLibrarySchema = new mongoose.Schema(
  {
    regionName: { type: String, maxlength: 50 },
    imageUrl: { type: String, maxlength: 500 },
    styleData: { type: mongoose.Schema.Types.Mixed },
    description: String,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("RegionalLibrary", regionalLibrarySchema);
