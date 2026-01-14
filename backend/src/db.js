// backend/src/db.js
const sql = require("mssql");
require("dotenv").config();

// Khớp chính xác với các biến trong file .env của bạn
const base = {
    server: process.env.DB_SERVER || "localhost", // Đổi từ DB_HOST thành DB_SERVER để khớp .env
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Thường để false cho SQL Server local (FUDGIN-LAPTOP)
        trustServerCertificate: true,
        enableArithAbort: true,
        multipleStatements: true,    // GIỮ NGUYÊN - Cực kỳ quan trọng như bạn đã note
        multipleActiveResultSets: true, // GIỮ NGUYÊN - Bắt buộc cho SQL Server
        useUTC: true,
    },
    pool: { 
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 30000 
    },
};

if (process.env.DB_PORT) base.port = Number(process.env.DB_PORT);

let config;
const authMode = (process.env.DB_AUTH || "sql").toLowerCase();

if (authMode === "windows") {
    let domain = process.env.DB_DOMAIN || "";
    let user = process.env.DB_USER || "";
    if (!domain && user && user.includes("\\")) {
        const [d, u] = user.split("\\");
        domain = d;
        user = u;
    }
    config = {
        ...base,
        authentication: {
            type: "ntlm",
            options: {
                domain: domain || undefined,
                userName: user || undefined,
                password: process.env.DB_PASS || "",
            },
        },
    };
} else {
    config = {
        ...base,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    };
}

let _pool = null;

async function getPool() {
    if (_pool) return _pool;
    try {
        // Sử dụng Singleton pattern để tái sử dụng pool cũ
        _pool = await new sql.ConnectionPool(config).connect();
        
        _pool.on('error', err => {
            console.error('❌ SQL Pool Error:', err);
            _pool = null; // Tự động reset để kết nối lại khi lỗi
        });

        return _pool;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        _pool = null;
        throw err;
    }
}

async function testDb() {
    try {
        const p = await getPool();
        const r = await p.request().query("SELECT 1 AS ok");
        const status = r.recordset?.[0]?.ok === 1;
        if (status) console.log(`✅ Kết nối thành công tới: ${process.env.DB_SERVER}\\${process.env.DB_NAME}`);
        return status;
    } catch (e) {
        console.error("❌ DB Check error:", e.message);
        return false;
    }
}

module.exports = { sql, config, getPool, testDb };
