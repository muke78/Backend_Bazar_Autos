import puppeteer from "puppeteer";
import ejs from "ejs";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import {
	SALES_COLUMNS,
	EXPENSES_COLUMNS,
	INVESTORS_COLUMNS,
	TRANSACTIONS_COLUMNS,
} from "./report-columns.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, "../templates/report.ejs");

// ── Formatters ──────────────────────────────────────────────────────────────
const MONEY_KEYS = new Set([
	"purchase_price", "total_costs", "price_for_sale", "profit", "amount",
	"capital", "total_entries", "total_exits", "net_balance",
]);

const moneyFmt = (v) => {
	if (v == null || v === "") return "";
	const n = Number(v);
	return isNaN(n)
		? String(v)
		: `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtDate = (v) => {
	if (!v) return "";
	if (v instanceof Date) return v.toISOString().slice(0, 10);
	return String(v).slice(0, 10);
};

const fmtCell = (col, row) => {
	const v = row[col.key];
	if (MONEY_KEYS.has(col.key)) return moneyFmt(v);
	if (col.key.includes("date") || col.key === "fecha") return fmtDate(v);
	return v != null ? String(v) : "";
};

// ── Transaction detail columns (for grouped view — no investor/email cols) ──
const TXN_DETAIL_COLS = [
	{ key: "transaction_id", label: "ID",       pct: "20" },
	{ key: "fecha",          label: "Fecha",    pct: "15" },
	{ key: "amount",         label: "Monto",    pct: "15" },
	{ key: "concept",        label: "Concepto", pct: "50" },
];

// ── Section builders ────────────────────────────────────────────────────────
const toSection = (title, columns, rows) => {
	const total = columns.reduce((s, c) => s + c.pdfWidth, 0);
	return {
		title,
		isGrouped: false,
		rows,
		columns: columns.map((c) => ({
			...c,
			pct: ((c.pdfWidth / total) * 100).toFixed(2),
		})),
	};
};

/**
 * Groups transactions by investor → { entradas: [], salidas: [] }
 * Each investor gets its own sub-block in the PDF.
 */
const toGroupedSection = (title, rows) => {
	const map = new Map();
	for (const t of rows) {
		if (!map.has(t.investor_name)) {
			map.set(t.investor_name, { name: t.investor_name, email: t.email, entradas: [], salidas: [] });
		}
		const g = map.get(t.investor_name);
		if (t.type === "Entrada") g.entradas.push(t);
		else g.salidas.push(t);
	}
	return {
		title,
		isGrouped: true,
		groups: Array.from(map.values()),
		detailCols: TXN_DETAIL_COLS,
		rows, // kept for totals
	};
};

const buildSections = (type, data) => {
	const sections = [];
	if (type === "sales" || type === "full")
		sections.push(toSection("Ventas", SALES_COLUMNS, data.sales || []));
	if (type === "expenses" || type === "full")
		sections.push(toSection("Gastos", EXPENSES_COLUMNS, data.expenses || []));
	if (type === "investments" || type === "full") {
		sections.push(toSection("Inversionistas", INVESTORS_COLUMNS, data.investors || []));
		sections.push(toGroupedSection("Transacciones de Inversión", data.transactions || []));
	}
	return sections;
};

// ── PDF generator ───────────────────────────────────────────────────────────
export const generatePdfReport = async (type, data, meta) => {
	const template = readFileSync(TEMPLATE_PATH, "utf-8");
	const sections = buildSections(type, data);

	const html = ejs.render(template, {
		type,
		meta,
		sections,
		fmtCell,
		moneyFmt,
	});

	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();
		await page.setContent(html, { waitUntil: "networkidle0" });

		const buffer = await page.pdf({
			format: "A4",
			landscape: true,
			printBackground: true,
			margin: { top: "18mm", bottom: "14mm", left: "10mm", right: "10mm" },
			displayHeaderFooter: true,
			headerTemplate: "<div></div>",
			footerTemplate: `
				<div style="font-family:Arial,sans-serif;font-size:8px;width:100%;
				     text-align:right;padding-right:10mm;color:#64748B;">
					P&aacute;gina <span class="pageNumber"></span>
					de <span class="totalPages"></span>
				</div>`,
		});

		return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
	} finally {
		await browser.close();
	}
};
