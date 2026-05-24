import { Router } from "express";
import { config } from "../config/config.js";
import { auth } from "./auth-routes.js";
import { users } from "./users-routes.js";
import { cars } from "./cars-routes.js";
import { investors } from "./investor-routes.js";
import { expenses } from "./expenses-routes.js";
import { categories } from "./categories-routes.js";
import { dashboard } from "./dashboard-routes.js";

const router = Router();

// ✅ 1. Se ocupa el path de la ruta para la api (/api/v1)
const base = config.api.basePath;

// ✅ 2. Construccion de rutas globales para el backend
router.use(`${base}/auth`, auth);
router.use(`${base}/users`, users);
router.use(`${base}/cars`, cars);
router.use(`${base}/investors`, investors);
router.use(`${base}/expenses`, expenses);
router.use(`${base}/categories`, categories);
router.use(`${base}/dashboard`, dashboard);

export { router };
