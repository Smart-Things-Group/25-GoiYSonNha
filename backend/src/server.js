const app = require("./app");
const { ensureAdminAccount } = require("./services/adminSeeder");

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  try {
    await ensureAdminAccount();
  } catch (error) {
    console.error("[AdminSeeder] Không thể tạo tài khoản admin mặc định:", error);
  }

  const server = app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
  
  // Tăng timeout cho server (3 phút cho AI image generation)
  server.timeout = 180000; // 180 seconds
  server.keepAliveTimeout = 180000;
  server.headersTimeout = 185000;
}

bootstrap();
