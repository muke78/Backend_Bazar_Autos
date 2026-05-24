import {
	SALES_COLUMNS,
	EXPENSES_COLUMNS,
	INVESTORS_COLUMNS,
	TRANSACTIONS_COLUMNS,
} from "./report-columns.js";

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const sectionToCSV = (title, columns, rows) => {
	const header = `=== ${title} ===`;
	const colHeaders = columns.map((c) => esc(c.label)).join(",");
	const dataLines = rows.map((row) =>
		columns.map((c) => esc(row[c.key] ?? "")).join(","),
	);
	return [header, colHeaders, ...dataLines].join("\n");
};

export const generateCsvReport = (type, data, meta) => {
	const metaLine = `# Reporte: ${type} | ${meta.dateFrom} → ${meta.dateTo} | Generado: ${meta.generatedAt}`;
	const sections = [];

	if (type === "sales" || type === "full") {
		sections.push(sectionToCSV("Ventas", SALES_COLUMNS, data.sales || []));
	}
	if (type === "expenses" || type === "full") {
		sections.push(sectionToCSV("Gastos", EXPENSES_COLUMNS, data.expenses || []));
	}
	if (type === "investments" || type === "full") {
		const txns = data.transactions || [];
		sections.push(sectionToCSV("Inversionistas", INVESTORS_COLUMNS, data.investors || []));

		// Group transactions by investor, then split by Entrada/Salida
		const byInvestor = new Map();
		for (const t of txns) {
			if (!byInvestor.has(t.investor_name)) byInvestor.set(t.investor_name, []);
			byInvestor.get(t.investor_name).push(t);
		}
		const txnBlocks = [];
		for (const [name, rows] of byInvestor) {
			txnBlocks.push(`--- ${name} ---`);
			txnBlocks.push(sectionToCSV("Entradas", TRANSACTIONS_COLUMNS, rows.filter((r) => r.type === "Entrada")));
			txnBlocks.push(sectionToCSV("Salidas",  TRANSACTIONS_COLUMNS, rows.filter((r) => r.type === "Salida")));
		}
		sections.push(`=== Transacciones de Inversión ===\n${txnBlocks.join("\n\n")}`);
	}

	return Buffer.from([metaLine, ...sections].join("\n\n"), "utf-8");
};
