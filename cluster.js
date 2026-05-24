/**
 * Cluster mode — usa todos los cores del VPS.
 *
 * Node.js es single-threaded por default. En un VPS de 4 cores, sin cluster
 * el backend solo aprovecha 1 core (25% del CPU). Con cluster:
 *  - Master fork un worker por CPU.
 *  - Cada worker corre el server completo (index.js).
 *  - SO balancea conexiones entre workers automáticamente.
 *  - Si un worker crashea, master lo respawn.
 *
 * Resultado: ~4x throughput en VPS de 4 cores.
 *
 * Uso:
 *   node cluster.js                       (todos los cores)
 *   CLUSTER_WORKERS=2 node cluster.js     (limita workers)
 *
 * Producción: PM2 hace lo mismo + monitoring (`pm2 start index.js -i max`).
 * Este archivo es alternativa standalone sin dependencias extra.
 */

import cluster from "node:cluster";
import os from "node:os";

const numCPUs = os.cpus().length;
const workersCount = Number(process.env.CLUSTER_WORKERS) || numCPUs;

if (cluster.isPrimary) {
	console.log(`🚀 Master ${process.pid} arrancando — forking ${workersCount} workers`);

	for (let i = 0; i < workersCount; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.warn(`⚠️  Worker ${worker.process.pid} murió (code=${code}, signal=${signal}). Respawning...`);
		cluster.fork();
	});

	// Graceful shutdown — propagar SIGTERM a workers
	const shutdown = (signal) => {
		console.log(`\n${signal} recibido — cerrando workers...`);
		for (const id in cluster.workers) {
			cluster.workers[id].kill(signal);
		}
		setTimeout(() => process.exit(0), 5000);
	};

	process.on("SIGTERM", () => shutdown("SIGTERM"));
	process.on("SIGINT", () => shutdown("SIGINT"));
} else {
	// Worker: importa el server normalmente
	import("./index.js");
	console.log(`✅ Worker ${process.pid} corriendo`);
}
