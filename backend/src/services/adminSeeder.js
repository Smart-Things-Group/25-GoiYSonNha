const bcrypt = require("bcrypt");
const User = require("../models/User");

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@ngoai-that.ai";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123456";

async function ensureAdminAccount() {
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    console.warn("[AdminSeeder] Thiếu DEFAULT_ADMIN_EMAIL hoặc DEFAULT_ADMIN_PASSWORD, bỏ qua seed admin.");
    return;
  }

  const existing = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`[AdminSeeder] Đã cập nhật role 'admin' cho ${DEFAULT_ADMIN_EMAIL}.`);
    }
    return;
  }

  const hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await User.create({
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash: hash,
    role: "admin",
  });

  console.log(`[AdminSeeder] Đã tạo tài khoản admin cố định ${DEFAULT_ADMIN_EMAIL}.`);
}

module.exports = { ensureAdminAccount };
