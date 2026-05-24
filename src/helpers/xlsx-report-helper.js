import ExcelJS from "exceljs";
import {
	SALES_COLUMNS,
	EXPENSES_COLUMNS,
	INVESTORS_COLUMNS,
	TRANSACTIONS_COLUMNS,
} from "./report-columns.js";

const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" }, size: 11, name: "Calibri" };
const HEADER_ALIGN = { horizontal: "center", vertical: "middle", wrapText: true };
const THIN_BORDER = { style: "thin", color: { argb: "FFB0BEC5" } };
const BORDER = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER };

const ROW_EVEN = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F4FF" } };
const ROW_ODD  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };

const currency = (v) => (v != null ? Number(v) : null);
const formatVal = (col, row) => {
	const v = row[col.key];
	if (col.key.includes("price") || col.key.includes("amount") || col.key.includes("profit")
		|| col.key.includes("cost") || col.key.includes("capital") || col.key.includes("entries")
		|| col.key.includes("exits") || col.key.includes("balance")) {
		return currency(v);
	}
	if (col.key.includes("date") || col.key === "fecha") {
		return v ? new Date(v) : null;
	}
	return v ?? "";
};

const buildSheet = (workbook, name, columns, rows, meta) => {
	const ws = workbook.addWorksheet(name, {
		views: [{ state: "frozen", ySplit: 2 }],
	});

	// Meta row (fecha generación, rango)
	ws.mergeCells(1, 1, 1, columns.length);
	const metaCell = ws.getCell(1, 1);
	metaCell.value = `${name} | ${meta.dateFrom} → ${meta.dateTo} | Generado: ${meta.generatedAt}`;
	metaCell.font = { italic: true, size: 9, color: { argb: "FF64748B" } };
	metaCell.alignment = { horizontal: "center" };
	ws.getRow(1).height = 18;

	// Column definitions + header row (row 2)
	ws.columns = columns.map((c) => ({
		header: c.label,
		key: c.key,
		width: c.excelWidth,
	}));
	// ExcelJS adds header in row 1 by default — move to row 2 by reinserting
	// Workaround: set columns without header, add header manually in row 2
	ws.columns = columns.map((c) => ({ key: c.key, width: c.excelWidth }));
	const headerRow = ws.getRow(2);
	columns.forEach((c, i) => {
		const cell = headerRow.getCell(i + 1);
		cell.value = c.label;
		cell.fill = HEADER_FILL;
		cell.font = HEADER_FONT;
		cell.alignment = HEADER_ALIGN;
		cell.border = BORDER;
	});
	headerRow.height = 28;

	// Data rows (starting row 3)
	rows.forEach((row, idx) => {
		const dataRow = ws.getRow(idx + 3);
		const fill = idx % 2 === 0 ? ROW_EVEN : ROW_ODD;

		columns.forEach((c, ci) => {
			const cell = dataRow.getCell(ci + 1);
			cell.value = formatVal(c, row);
			cell.fill = fill;
			cell.border = BORDER;
			cell.alignment = { vertical: "middle" };

			// Currency format
			if (["purchase_price","total_costs","price_for_sale","profit","amount",
				 "capital","total_entries","total_exits","net_balance"].includes(c.key)) {
				cell.numFmt = '"$"#,##0.00';
			}
			// Date format
			if (c.key === "purchase_date" || c.key === "sale_date") {
				cell.numFmt = "yyyy-mm-dd";
			}
		});

		dataRow.height = 18;
	});

	// Auto-filter on header row
	ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: columns.length } };

	// Totals row for numeric columns
	if (rows.length > 0) {
		const totalRow = ws.getRow(rows.length + 3);
		totalRow.getCell(1).value = "TOTAL";
		totalRow.getCell(1).font = { bold: true };

		const numericKeys = ["purchase_price","total_costs","price_for_sale","profit",
			"amount","capital","total_entries","total_exits","net_balance"];
		columns.forEach((c, ci) => {
			if (numericKeys.includes(c.key)) {
				const startRow = 3;
				const endRow = rows.length + 2;
				const colLetter = ws.getColumn(ci + 1).letter;
				const cell = totalRow.getCell(ci + 1);
				cell.value = { formula: `SUM(${colLetter}${startRow}:${colLetter}${endRow})` };
				cell.numFmt = '"$"#,##0.00';
				cell.font = { bold: true };
				cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } };
				cell.border = BORDER;
			}
		});
		totalRow.height = 20;
	}
};

export const generateXlsxReport = async (type, data, meta) => {
	const wb = new ExcelJS.Workbook();
	wb.creator = "Bazar Autos";
	wb.created = new Date();

	if (type === "sales" || type === "full") {
		buildSheet(wb, "Ventas", SALES_COLUMNS, data.sales || [], meta);
	}
	if (type === "expenses" || type === "full") {
		buildSheet(wb, "Gastos", EXPENSES_COLUMNS, data.expenses || [], meta);
	}
	if (type === "investments" || type === "full") {
		const txns = data.transactions || [];
		buildSheet(wb, "Inversionistas", INVESTORS_COLUMNS, data.investors || [], meta);
		buildSheet(wb, "Trans. Entradas", TRANSACTIONS_COLUMNS, txns.filter((t) => t.type === "Entrada"), meta);
		buildSheet(wb, "Trans. Salidas",  TRANSACTIONS_COLUMNS, txns.filter((t) => t.type === "Salida"),  meta);
	}

	return await wb.xlsx.writeBuffer();
};
