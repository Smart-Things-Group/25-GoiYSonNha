const { connectDB } = require("./db");
const app = require("./app");
const { ensureAdminAccount } = require("./services/adminSeeder");

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  await connectDB();

  try {
    await ensureAdminAccount();
  } catch (error) {
    console.error("[AdminSeeder] Không thể tạo tài khoản admin mặc định:", error);
  }

  const server = app.listen(PORT, () => console.log("🚀 Server running on port", PORT));

  server.timeout = 180000;
  server.keepAliveTimeout = 180000;
  server.headersTimeout = 185000;
}

bootstrap();
