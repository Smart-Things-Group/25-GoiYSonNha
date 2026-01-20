const jwt = require("jsonwebtoken");
const { getPool, sql } = require("../db");

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    
    // Debug logging
    console.log("[Auth] Authorization header present:", !!authHeader);
    console.log("[Auth] JWT_SECRET configured:", !!process.env.JWT_SECRET);
    
    if (!authHeader.startsWith("Bearer ")) {
      console.log("[Auth] Missing Bearer token");
      return res
        .status(401)
        .json({ ok: false, message: "Thiếu token (Bearer ...)" });
    }

    const token = authHeader.split(" ")[1];
    console.log("[Auth] Token length:", token?.length || 0);
    
    if (!process.env.JWT_SECRET) {
      console.error("[Auth] ERROR: JWT_SECRET is not configured!");
      return res.status(500).json({ ok: false, message: "Server configuration error: JWT_SECRET not set" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Auth] Token decoded successfully, userId:", decoded?.userId);

    if (!decoded?.userId) {
      console.log("[Auth] Token missing userId");
      return res.status(401).json({ ok: false, message: "Token không hợp lệ" });
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("Id", sql.BigInt, Number(decoded.userId))
      .query("SELECT Id, Email, Role FROM Users WHERE Id = @Id");

    const user = result.recordset[0];
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Tài khoản không còn tồn tại" });
    }

    req.user = {
      ...decoded,
      id: user.Id,
      userId: user.Id,
      email: user.Email,
      role: user.Role || decoded.role || "user",
    };

    next();
  } catch (err) {
    console.error("[Auth] Token verification failed:", err.message);
    console.error("[Auth] Error type:", err.name);
    res.status(401).json({ ok: false, message: "Token không hợp lệ" });
  }
}

module.exports = auth;
