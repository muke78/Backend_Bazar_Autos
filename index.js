import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import statusMonitor from "express-status-monitor";
import { router } from "./src/routes/index.js";
import { config } from "./src/config/config.js";
import { corsOptions } from "./src/middlewares/cors-middlewares.js";
import { setupSwagger } from "./src/config/swagger-config.js";
import { errorHandler } from "./src/middlewares/error-middlewares.js";
import {
	burstProtectionLimiter,
	normalLimiter,
} from "./src/middlewares/limit-middlewares.js";
import { testConnection } from "./src/lib/db.js";

// Puerto que se tiene que ocupar
const port = config.port ?? 3000;

const app = express();

// ✅ 0. Monitor de performance en tiempo real (debe ir ANTES de otros middlewares)
// Acceso: http://localhost:PORT/status
app.use(
	statusMonitor({
		title: "Bazar Autos — Backend Monitor",
		path: "/status",
		spans: [
			{ interval: 1, retention: 60 },   // 1s × 60 = último minuto
			{ interval: 5, retention: 60 },   // 5s × 60 = últimos 5 min
			{ interval: 15, retention: 60 },  // 15s × 60 = últimos 15 min
		],
		chartVisibility: {
			cpu: true,
			mem: true,
			load: true,
			eventLoop: true,
			heap: true,
			responseTime: true,
			rps: true,
			statusCodes: true,
		},
		healthChecks: [
			{
				protocol: "http",
				host: "localhost",
				path: `${config.api.basePath}`,
				port: port,
			},
		],
	}),
);

// ✅ 1. Configuracion de swagger para la documentacion de API's
setupSwagger(app);

// ✅ 2. Middlewares básicos
app.use(cors(corsOptions));
app.use(compression()); // gzip JSON/HTML responses
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// morgan solo en desarrollo (en producción genera I/O sincrónico costoso)
if (config.nodeEnv !== "production") {
	app.use(morgan("dev"));
}

app.use(helmet());
app.use(cookieParser());

// ✅ 3 Ruta raíz de entrada cuando entras al servidor local
app.get(`${config.api.basePath}`, async (_req, res) => {
	const dbStatus = await testConnection();
	const statusCode = dbStatus ? 200 : 503;
	res.status(statusCode).json({
		name: "Backend Bazar Autos",
		description:
			"Backend hecho para un bazar de autos,  para un control financiero",
		version: "1.0.0",
		environment: config.nodeEnv,
		api: config.api.basePath,
		documentation: config.docs.baseUrl,
		authors: [
			{
				name: "Erick Gonzalez",
				github: "https://github.com/muke78",
			},
			{
				name: "Osvaldo Cabrera",
				github: "https://github.com/OsvaldoBC6",
			},
		],
		status: {
			api: "running",
			database: dbStatus ? "🟢 Connected" : "🔴 Disconnected",
			uptime: process.uptime(),
		},
	});
});

// ✅ 4. Rutas de la API (ya con rate limiting aplicado)
if (config.nodeEnv === "production") {
	app.use(`${config.api.basePath}/auth/login`, burstProtectionLimiter);
	app.use(`${config.api.basePath}`, normalLimiter);
}

app.use(router);

// ✅ 5. Middleware de errores
app.use(errorHandler);

// ✅ 7. Asignacion del puerto para el backend
app.set("port", port);

// ✅ 8. Ejecucion del servidor de forma local
app.listen(app.get("port"), () => {
	console.log(
		`API funcionando correctamente, servidor corriendo en el puerto http://localhost:${port}${config.api.basePath}`,
	);
});
