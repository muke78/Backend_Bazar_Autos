// Columnas compartidas entre xlsx, csv y pdf generators.
// excelWidth = width en chars (ExcelJS), pdfWidth = width en pts (PDFKit landscape A4, working ~750pts)

export const SALES_COLUMNS = [
	{ key: "car_id",            label: "ID",               excelWidth: 38, pdfWidth: 48 },
	{ key: "brand",             label: "Marca",            excelWidth: 14, pdfWidth: 52 },
	{ key: "model",             label: "Modelo",           excelWidth: 18, pdfWidth: 60 },
	{ key: "year_of_car",       label: "Año",              excelWidth: 8,  pdfWidth: 34 },
	{ key: "color",             label: "Color",            excelWidth: 14, pdfWidth: 46 },
	{ key: "status",            label: "Estado",           excelWidth: 14, pdfWidth: 56 },
	{ key: "purchase_price",    label: "Precio Compra",    excelWidth: 16, pdfWidth: 62 },
	{ key: "total_costs",       label: "Costos Adicionales", excelWidth: 20, pdfWidth: 68 },
	{ key: "price_for_sale",    label: "Precio Venta",     excelWidth: 16, pdfWidth: 62 },
	{ key: "profit",            label: "Utilidad",         excelWidth: 16, pdfWidth: 60 },
	{ key: "days_in_inventory", label: "Días Inventario",  excelWidth: 16, pdfWidth: 62 },
	{ key: "purchase_date",     label: "Fecha Compra",     excelWidth: 16, pdfWidth: 60 },
	{ key: "sale_date",         label: "Fecha Venta",      excelWidth: 16, pdfWidth: 60 },
];

export const EXPENSES_COLUMNS = [
	{ key: "movements_id",  label: "ID",              excelWidth: 38, pdfWidth: 48 },
	{ key: "closing_date",  label: "Fecha",           excelWidth: 14, pdfWidth: 66 },
	{ key: "category",      label: "Categoría",       excelWidth: 20, pdfWidth: 80 },
	{ key: "category_type", label: "Tipo Categoría",  excelWidth: 16, pdfWidth: 70 },
	{ key: "movement_type", label: "Tipo Movimiento", excelWidth: 16, pdfWidth: 70 },
	{ key: "amount",        label: "Monto",           excelWidth: 16, pdfWidth: 70 },
	{ key: "description",   label: "Descripción",     excelWidth: 30, pdfWidth: 110 },
	{ key: "car_brand",     label: "Marca Auto",      excelWidth: 14, pdfWidth: 60 },
	{ key: "car_model",     label: "Modelo Auto",     excelWidth: 18, pdfWidth: 66 },
	{ key: "car_year",      label: "Año Auto",        excelWidth: 10, pdfWidth: 40 },
];

export const INVESTORS_COLUMNS = [
	{ key: "investor_id",        label: "ID",              excelWidth: 38, pdfWidth: 48 },
	{ key: "full_name",          label: "Nombre",          excelWidth: 25, pdfWidth: 110 },
	{ key: "email",              label: "Email",           excelWidth: 28, pdfWidth: 130 },
	{ key: "capital",            label: "Capital",         excelWidth: 16, pdfWidth: 80 },
	{ key: "total_transactions", label: "# Trans.",        excelWidth: 12, pdfWidth: 52 },
	{ key: "total_entries",      label: "Total Entradas",  excelWidth: 16, pdfWidth: 80 },
	{ key: "total_exits",        label: "Total Salidas",   excelWidth: 16, pdfWidth: 80 },
	{ key: "net_balance",        label: "Saldo Neto",      excelWidth: 16, pdfWidth: 80 },
];

export const TRANSACTIONS_COLUMNS = [
	{ key: "transaction_id",  label: "ID",             excelWidth: 38, pdfWidth: 48 },
	{ key: "fecha",           label: "Fecha",          excelWidth: 18, pdfWidth: 100 },
	{ key: "investor_name",   label: "Inversionista",  excelWidth: 25, pdfWidth: 130 },
	{ key: "email",           label: "Email",          excelWidth: 28, pdfWidth: 140 },
	{ key: "type",            label: "Tipo",           excelWidth: 12, pdfWidth: 60 },
	{ key: "amount",          label: "Monto",          excelWidth: 16, pdfWidth: 80 },
	{ key: "concept",         label: "Concepto",       excelWidth: 30, pdfWidth: 130 },
];
