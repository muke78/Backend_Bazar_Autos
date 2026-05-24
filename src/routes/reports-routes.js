import express from "express";
import { verifyToken } from "../middlewares/verify-jwt-middlewares.js";
import { requireRole } from "../middlewares/authorize-roles-middlewares.js";
import { validationFields } from "../middlewares/validation-middlewares.js";
import { schemaExportReport } from "../schemas/reports-schemas.js";
import { ExportReport } from "../controllers/reports-controllers.js";

const reports = express.Router();

// POST /api/v1/reports/export
reports.post(
	"/export",
	verifyToken,
	requireRole("admin"),
	validationFields(schemaExportReport, "body"),
	ExportReport,
);

export { reports };
