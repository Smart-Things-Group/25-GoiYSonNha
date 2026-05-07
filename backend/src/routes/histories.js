const express = require("express");
const router = express.Router();
const Generation = require("../models/Generation");
const asyncHandler = require("../middlewares/asyncHandler");
const auth = require("../middlewares/auth");

router.get("/histories", auth, asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 12 } = req.query;
  page = Math.max(parseInt(page, 10) || 1, 1);
  pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 12, 1), 50);

  const userId = req.user.id;
  const offset = (page - 1) * pageSize;

  const total = await Generation.countDocuments({ userId });

  const raw = await Generation.find({ userId })
    .select("userId inputDesc inputImageUrl outputImageUrl style palette promptUsed createdAt")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(pageSize)
    .lean();

  const items = raw.map(item => ({ ...item, id: item._id }));

  res.ok({ page, pageSize, total, items });
}));

module.exports = router;
