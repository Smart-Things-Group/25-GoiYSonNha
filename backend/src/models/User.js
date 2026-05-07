const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, maxlength: 191 },
    passwordHash: { type: String, required: true, maxlength: 255 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("User", userSchema);
