import { Router } from "express";
import { config } from "../config/config.js";
import { auth } from "./auth-routes.js";

const router = Router();

// ✅ 1. Se ocupa el path de la ruta para la api (/api/v1)
const base = config.api.basePath;

// ✅ 2. Construccion de rutas globales para el backend
router.use(`${base}/auth`, auth);
// router.use(`${base}/users`);

export { router };
