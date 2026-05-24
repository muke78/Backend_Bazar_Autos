import puppeteer from "puppeteer-core";

/**
 * Browser singleton — un solo Chromium para todo el proceso.
 *
 * Por qué:
 *  - puppeteer.launch() tarda ~1-3s y consume ~300MB cada vez.
 *  - Bajo carga (10 usuarios pidiendo PDF) lanzaría 10 navegadores = ~3GB RAM.
 *  - Reusar un solo browser y abrir páginas por request es ~50x más barato.
 *
 * Estrategia:
 *  - Lazy init: se lanza al primer PDF.
 *  - Si crashea, se relanza en la siguiente petición.
 *  - Graceful shutdown cierra el browser al salir el proceso.
 */

let browserPromise = null;

const launchBrowser = async () => {
	const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

	const browser = await puppeteer.launch({
		headless: true,
		...(executablePath ? { executablePath } : { channel: "chrome" }),
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--disable-gpu",
			"--disable-accelerated-2d-canvas",
			"--no-first-run",
			"--no-zygote",
			"--disable-background-timer-throttling",
			"--disable-backgrounding-occluded-windows",
			"--disable-renderer-backgrounding",
			"--disable-features=TranslateUI,BlinkGenPropertyTrees",
			"--disable-ipc-flooding-protection",
		],
	});

	// Si el browser muere, limpia el cache para relanzar en próximo request
	browser.on("disconnected", () => {
		console.warn("⚠️  Puppeteer browser disconnected. Will relaunch on next request.");
		browserPromise = null;
	});

	console.log("✅ Puppeteer browser launched (singleton)");
	return browser;
};

export const getBrowser = () => {
	if (!browserPromise) {
		browserPromise = launchBrowser().catch((err) => {
			browserPromise = null;
			throw err;
		});
	}
	return browserPromise;
};

export const closeBrowser = async () => {
	if (!browserPromise) return;
	try {
		const browser = await browserPromise;
		await browser.close();
	} catch (err) {
		console.error("Error closing browser:", err.message);
	} finally {
		browserPromise = null;
	}
};

// Cierre limpio al apagar el proceso
const shutdown = async (signal) => {
	console.log(`\n${signal} recibido, cerrando browser...`);
	await closeBrowser();
	process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
