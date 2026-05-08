// 📁 src/app.js
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load env from backend/.env no matter the working directory
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { testDb } = require("./db");
const wizardRoutes = require("./routes/wizard");
const historiesRoutes = require("./routes/histories");
const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const designRoutes = require("./routes/designs");
const colorRoutes = require("./routes/colors");
const mixmatchRoutes = require("./routes/mixmatch");
//const libraryRoutes = require("./routes/library");

// 🧩 middlewares
const respond = require("./middlewares/respond");
const errorHandler = require("./middlewares/error");
const activityLogger = require("./middlewares/activityLogger");
const fileUpload = require("express-fileupload");
const auth = require("./middlewares/auth");
const multer = require("multer");
const requireAdmin = require("./middlewares/isAdmin");


const app = express();
app.use((req, res, next) => {
  res.ok = (data) => {
    res.json({
      ok: true,
      ...data
    });
  };
  next();
});

// ✅ Cấu hình cơ bản
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { ok: false, message: "Quá nhiều request. Vui lòng thử lại sau 15 phút." },
});
app.use("/api", apiLimiter);

app.use(morgan(":method :url :status :response-time ms"));
// ✅ Parser JSON cho các route API thông thường
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", wizardRoutes);

// ✅ Mix & Match routes (sử dụng multer, đặt trước fileUpload middleware)
app.use("/api/mixmatch", mixmatchRoutes);

// ✅ Route admin phải được đặt TRƯỚC global fileUpload middleware
// vì admin routes sử dụng multer cho file upload (multer và express-fileupload conflict)
app.use("/api/admin", auth, requireAdmin, adminRoutes);

// ✅ Các route không cần fileUpload
app.use("/api/histories", historiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/visualizer", designRoutes);
app.use("/api/colors", colorRoutes);
//app.use("/api/library", libraryRoutes);

// ✅ Route upload riêng có middleware fileUpload
app.use(
  "/api/upload-sample",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
  wizardRoutes
);

// ✅ Global fileUpload cho các route cũ cần nó (như wizard generate-final)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ✅ Route yêu cầu đăng nhập (JWT)
app.use("/api/secure", auth, wizardRoutes);
app.use("/api/secure", auth, historiesRoutes);

// ✅ Chuẩn hóa phản hồi
app.use(respond);

// ✅ Health check
app.get("/health", async (_req, res) => {
  const ok = await testDb();
  res.ok({ time: new Date().toISOString(), ok });
});

// ✅ Logging + Bắt lỗi
app.use(activityLogger);
app.use(errorHandler);

module.exports = app;
