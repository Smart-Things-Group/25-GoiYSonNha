const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "Thiếu token (Bearer ...)" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("[Auth] ERROR: JWT_SECRET is not configured!");
      return res.status(500).json({ ok: false, message: "Server configuration error: JWT_SECRET not set" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ ok: false, message: "Token không hợp lệ" });
    }

    const user = await User.findById(decoded.userId).select("_id email role");
    if (!user) {
      return res.status(401).json({ ok: false, message: "Tài khoản không còn tồn tại" });
    }

    req.user = {
      ...decoded,
      id: user._id,
      userId: user._id,
      email: user.email,
      role: user.role || decoded.role || "user",
    };

    next();
  } catch (err) {
    console.error("[Auth] Token verification failed:", err.message);
    res.status(401).json({ ok: false, message: "Token không hợp lệ" });
  }
}

module.exports = auth;
