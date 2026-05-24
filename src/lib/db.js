import mysql from "mysql2/promise";
import { config } from "../config/config.js";

// Pool de conexiones MySQL
export const pool = mysql.createPool({
	host: config.db.host,
	port: config.db.port,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	waitForConnections: config.db.waitForConnections,
	connectionLimit: config.db.connectionLimit,
	queueLimit: config.db.queueLimit,
	maxIdle: config.db.maxIdle,
	idleTimeout: config.db.idleTimeout,
	enableKeepAlive: config.db.enableKeepAlive,
	keepAliveInitialDelay: config.db.keepAliveInitialDelay,
	multipleStatements: config.db.multipleStatements,
});

// ── Health check con cache (evita ping a BD en cada request) ────────────────
let lastCheck = { ts: 0, ok: false };
const HEALTH_TTL_MS = 5000; // 5s

export const testConnection = async () => {
	const now = Date.now();
	if (now - lastCheck.ts < HEALTH_TTL_MS) return lastCheck.ok;

	try {
		const connection = await pool.getConnection();
		connection.release();
		lastCheck = { ts: now, ok: true };
		return true;
	} catch (error) {
		console.error("❌ DB error:", error.message);
		lastCheck = { ts: now, ok: false };
		return false;
	}
};

// Ping inicial único al arrancar
testConnection().then((ok) => {
	console.log(ok ? "✅ MySQL pool listo" : "❌ MySQL pool falló al iniciar");
});
