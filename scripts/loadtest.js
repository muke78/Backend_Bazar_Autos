/**
 * Load test — simula carga real contra el backend.
 *
 * Instala autocannon una vez:
 *   pnpm add -D autocannon
 *
 * Uso:
 *   node scripts/loadtest.js dashboard       (10 usuarios concurrentes, 30s)
 *   node scripts/loadtest.js reports         (carga al endpoint pesado)
 *   node scripts/loadtest.js root            (health check, baseline)
 *
 * Requiere:
 *   - Backend corriendo en http://localhost:3000
 *   - Variable AUTH_TOKEN exportada con un JWT válido (para endpoints protegidos)
 */

import autocannon from "autocannon";

const BASE_URL = process.env.LOADTEST_URL || "http://localhost:3000";
const TOKEN = process.env.AUTH_TOKEN || "";
const CONNECTIONS = Number(process.env.LOADTEST_CONNECTIONS) || 10;
const DURATION = Number(process.env.LOADTEST_DURATION) || 30; // segundos

const scenario = process.argv[2] || "root";

const scenarios = {
	root: {
		url: `${BASE_URL}/api/v1`,
		method: "GET",
		title: "Root health check",
	},
	dashboard: {
		url: `${BASE_URL}/api/v1/dashboard?year=2024`,
		method: "GET",
		headers: TOKEN ? { authorization: `Bearer ${TOKEN}` } : {},
		title: "Dashboard endpoint (21 queries en paralelo + cache)",
	},
	reports: {
		url: `${BASE_URL}/api/v1/reports/export`,
		method: "POST",
		headers: {
			"content-type": "application/json",
			...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
		},
		body: JSON.stringify({
			type: "sales",
			format: "pdf",
			date_from: "2024-01-01",
			date_to: "2024-12-31",
		}),
		title: "Reports export PDF (Puppeteer singleton)",
	},
};

const config = scenarios[scenario];
if (!config) {
	console.error(`❌ Scenario desconocido: ${scenario}`);
	console.error(`   Usa: ${Object.keys(scenarios).join(", ")}`);
	process.exit(1);
}

console.log(`\n🚀 Load test: ${config.title}`);
console.log(`   URL: ${config.method} ${config.url}`);
console.log(`   Conexiones concurrentes: ${CONNECTIONS}`);
console.log(`   Duración: ${DURATION}s\n`);

const instance = autocannon(
	{
		url: config.url,
		method: config.method,
		headers: config.headers,
		body: config.body,
		connections: CONNECTIONS,
		duration: DURATION,
		timeout: 60, // PDF tarda
	},
	(err, result) => {
		if (err) {
			console.error("Error:", err);
			process.exit(1);
		}
		console.log("\n📊 Resumen:");
		console.log(`   Requests totales:     ${result.requests.total}`);
		console.log(`   Requests/seg (avg):   ${result.requests.average.toFixed(2)}`);
		console.log(`   Latencia p50:         ${result.latency.p50} ms`);
		console.log(`   Latencia p99:         ${result.latency.p99} ms`);
		console.log(`   Latencia max:         ${result.latency.max} ms`);
		console.log(`   Throughput:           ${(result.throughput.average / 1024).toFixed(2)} KB/s`);
		console.log(`   Errores:              ${result.errors}`);
		console.log(`   Timeouts:             ${result.timeouts}`);
		console.log(`   Non-2xx:              ${result.non2xx}`);
	},
);

// Stream progreso en consola
autocannon.track(instance, { renderProgressBar: true });

process.once("SIGINT", () => {
	instance.stop();
});
