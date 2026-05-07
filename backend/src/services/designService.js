const DesignConfig = require("../models/DesignConfig");

async function saveDesign(generationId, userId, configJson) {
  return DesignConfig.findOneAndUpdate(
    { generationId },
    { generationId, userId, configJson, updatedAt: new Date() },
    { upsert: true, new: true }
  );
}

async function getDesign(generationId) {
  return DesignConfig.findOne({ generationId });
}

module.exports = { saveDesign, getDesign };
