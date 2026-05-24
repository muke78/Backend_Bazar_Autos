import {
	getSalesReportModel,
	getExpensesReportModel,
	getInvestorsReportModel,
	getTransactionsReportModel,
} from "../models/reports-models.js";
import { generateXlsxReport } from "../helpers/xlsx-report-helper.js";
import { generateCsvReport } from "../helpers/csv-report-helper.js";
import { generatePdfReport } from "../helpers/pdf-report-helper.js";

const fmtDate = (d) => d.toISOString().slice(0, 10);

const fetchData = async (type, dateFrom, dateTo) => {
	const data = {};

	const tasks = [];

	if (type === "sales" || type === "full") {
		tasks.push(
			getSalesReportModel(dateFrom, dateTo).then((r) => {
				data.sales = r;
			}),
		);
	}
	if (type === "expenses" || type === "full") {
		tasks.push(
			getExpensesReportModel(dateFrom, dateTo).then((r) => {
				data.expenses = r;
			}),
		);
	}
	if (type === "investments" || type === "full") {
		tasks.push(
			getInvestorsReportModel(dateFrom, dateTo).then((r) => {
				data.investors = r;
			}),
			getTransactionsReportModel(dateFrom, dateTo).then((r) => {
				data.transactions = r;
			}),
		);
	}

	await Promise.all(tasks);
	return data;
};

const MIME = {
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	csv: "text/csv; charset=utf-8",
	pdf: "application/pdf",
};

const EXT = { xlsx: "xlsx", csv: "csv", pdf: "pdf" };

export const exportReportService = async ({ type, format, date_from, date_to }) => {
	const dateFrom = fmtDate(new Date(date_from));
	const dateTo = fmtDate(new Date(date_to));
	const generatedAt = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

	const meta = { dateFrom, dateTo, generatedAt };

	const data = await fetchData(type, dateFrom, dateTo);

	let buffer;
	if (format === "xlsx") {
		buffer = await generateXlsxReport(type, data, meta);
	} else if (format === "csv") {
		buffer = generateCsvReport(type, data, meta);
	} else {
		buffer = await generatePdfReport(type, data, meta);
	}

	const filename = `reporte-${type}-${dateFrom}_${dateTo}.${EXT[format]}`;

	return { buffer, filename, contentType: MIME[format] };
};
