export const corsOptions = {
	origin: [
		"http://localhost:5173",
		"http://localhost:5174",
		"http://localhost:4173",
		// Produccion
		"https://bazar-auto.com",
		"https://www.bazar-auto.com",
	],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Authorization",
		"Content-Type",
		"X-Requested-With",
		"Accept",
	],
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204,
};
