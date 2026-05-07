const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { page = 1, pageSize = 20, search = "", role = "" } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);

    const sanitizedSearch = search.trim();
    const normalizedRole = (role || "").trim().toLowerCase();

    const filter = {};
    if (sanitizedSearch) {
      filter.email = { $regex: sanitizedSearch, $options: "i" };
    }
    if (normalizedRole && normalizedRole !== "all") {
      filter.role = normalizedRole;
    }

    const offset = (page - 1) * pageSize;

    const total = await User.countDocuments(filter);

    const roleSummaryAgg = await User.aggregate([
      { $match: filter },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const roleSummary = roleSummaryAgg.reduce((acc, row) => {
      acc[(row._id || "unknown").toLowerCase()] = row.count;
      return acc;
    }, {});

    const users = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "generations",
          localField: "_id",
          foreignField: "userId",
          as: "generations",
        },
      },
      {
        $addFields: {
          id: "$_id",
          generationCount: { $size: "$generations" },
          lastGenerationAt: { $max: "$generations.createdAt" },
        },
      },
      { $project: { generations: 0, passwordHash: 0, __v: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: pageSize },
    ]);

    res.json({
      ok: true,
      data: { page, pageSize, total, roleSummary, items: users },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, passwordHash: hash, role: "user" });

    res.json({ ok: true, message: "Đăng ký thành công!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, message: "Email đã tồn tại" });
    }
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, message: "Email không tồn tại" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ ok: false, message: "Sai mật khẩu" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
