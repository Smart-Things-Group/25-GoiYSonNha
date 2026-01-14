const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// GET /api/library/regions
router.get("/regions", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM RegionalLibrary ORDER BY RegionName");
        res.json({ ok: true, data: result.recordset });
    } catch (error) {
        console.error("Lỗi lấy thư viện vùng miền:", error);
        res.status(500).json({ ok: false, message: "Lỗi kết nối database" });
    }
});

module.exports = router;