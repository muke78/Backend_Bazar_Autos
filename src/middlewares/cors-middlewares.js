// Configuración de CORS
export const corsOptions = {
	origin: [
		"http://localhost:5173",
		"http://localhost:5174",
		"http://localhost:4173",
		"http://localhost:5173/login",
		"https://bazar-autos.vercel.app"
	],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Authorization", "Content-Type", "X-Requested-With"],
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204
};
