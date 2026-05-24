import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

const run = async (ctx, query, params = []) => {
	try {
		return await connectionQuery(query, params);
	} catch (error) {
		throw new DatabaseError(`Error al generar reporte: ${ctx}`, {
			context: ctx,
			metadata: { originalError: error.message, sqlMessage: error.sqlMessage },
		});
	}
};

// Ventas — cars + car_costs filtrado por sale_date
export const getSalesReportModel = async (dateFrom, dateTo) => {
	const query = `
		SELECT
			c.car_id,
			c.brand,
			c.model,
			c.year_of_car,
			c.color,
			c.status,
			c.purchase_price,
			COALESCE(SUM(cc.amount), 0) AS total_costs,
			c.price_for_sale,
			(c.price_for_sale - c.purchase_price) profit,
			DATEDIFF(c.sale_date, c.purchase_date) AS days_in_inventory,
			c.purchase_date,
			c.sale_date
		FROM cars c
		LEFT JOIN car_costs cc ON cc.car_id = c.car_id
		WHERE c.status = 'Vendido'
			AND c.sale_date BETWEEN ? AND ?
		GROUP BY c.car_id
		ORDER BY c.sale_date DESC;
	`;
	return await run("getSalesReportModel", query, [dateFrom, dateTo]);
};

// Gastos — movements + movements_category + cars filtrado por closing_date
export const getExpensesReportModel = async (dateFrom, dateTo) => {
	const query = `
		SELECT
			m.movements_id,
			m.closing_date,
			mc.name AS category,
			mc.type AS category_type,
			m.type AS movement_type,
			m.amount,
			COALESCE(m.description, '') AS description,
			COALESCE(c.brand, '') AS car_brand,
			COALESCE(c.model, '') AS car_model,
			COALESCE(c.year_of_car, '') AS car_year
		FROM movements m
		INNER JOIN movements_category mc ON mc.category_id = m.movements_category_id
		LEFT JOIN cars c ON c.car_id = m.car_id
		WHERE m.closing_date BETWEEN ? AND ?
		ORDER BY m.closing_date DESC;
	`;
	return await run("getExpensesReportModel", query, [dateFrom, dateTo]);
};

// Inversiones — resumen por inversionista con totales de transacciones en el periodo
export const getInvestorsReportModel = async (dateFrom, dateTo) => {
	const query = `
		SELECT
			i.investor_id,
			u.full_name,
			u.email,
			i.investment_amount AS capital,
			COUNT(it.transaction_id) AS total_transactions,
			COALESCE(SUM(CASE WHEN it.type = 'Entrada' THEN it.amount ELSE 0 END), 0) AS total_entries,
			COALESCE(SUM(CASE WHEN it.type = 'Salida' THEN it.amount ELSE 0 END), 0) AS total_exits,
			COALESCE(SUM(CASE WHEN it.type = 'Entrada' THEN it.amount ELSE -it.amount END), 0) AS net_balance
		FROM investor i
		INNER JOIN users u ON u.user_id = i.user_id
		LEFT JOIN investor_transactions it
			ON it.investor_id = i.investor_id
			AND DATE(it.created) BETWEEN ? AND ?
		GROUP BY i.investor_id, u.full_name, u.email, i.investment_amount
		ORDER BY i.investment_amount DESC;
	`;
	return await run("getInvestorsReportModel", query, [dateFrom, dateTo]);
};

// Transacciones — detalle de movimientos de inversión en el periodo
export const getTransactionsReportModel = async (dateFrom, dateTo) => {
	const query = `
		SELECT
			it.transaction_id,
			DATE_FORMAT(it.created, '%Y-%m-%d %H:%i') AS fecha,
			u.full_name AS investor_name,
			u.email,
			it.type,
			it.amount,
			COALESCE(it.concept, '') AS concept
		FROM investor_transactions it
		INNER JOIN investor i ON i.investor_id = it.investor_id
		INNER JOIN users u ON u.user_id = i.user_id
		WHERE DATE(it.created) BETWEEN ? AND ?
		ORDER BY u.full_name ASC, it.type ASC, it.created DESC;
	`;
	return await run("getTransactionsReportModel", query, [dateFrom, dateTo]);
};
