import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

// Construye WHERE dinámico para campo created (DATETIME) por year/month
const buildTimeWhere = (year, month, col = "created", alias = "") => {
	const c = alias ? `${alias}.${col}` : col;
	const conditions = [];
	const params = [];

	if (year) {
		conditions.push(`YEAR(${c}) = ?`);
		params.push(Number(year));
	}
	if (month) {
		conditions.push(`MONTH(${c}) = ?`);
		params.push(Number(month));
	}

	return {
		where: conditions.length > 0 ? conditions.join(" AND ") : "1=1",
		params,
	};
};

const runQuery = async (context, query, params = []) => {
	try {
		return await connectionQuery(query, params);
	} catch (error) {
		throw new DatabaseError(`Error en ${context}`, {
			context,
			metadata: {
				originalError: error.message,
				sqlMessage: error.sqlMessage,
				code: error.code,
			},
		});
	}
};

// ============ KPIs ============

export const getTotalSalesModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `
		SELECT COALESCE(SUM(price_for_sale), 0) AS total
		FROM cars
		WHERE status = 'Vendido' AND price_for_sale IS NOT NULL AND ${where};
	`;
	const rows = await runQuery("getTotalSalesModel", query, params);
	return Number(rows[0]?.total || 0);
};

export const getTotalProfitModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `
		SELECT COALESCE(SUM(price_for_sale - purchase_price), 0) AS total
		FROM cars
		WHERE status = 'Vendido' AND price_for_sale IS NOT NULL AND ${where};
	`;
	const rows = await runQuery("getTotalProfitModel", query, params);
	return Number(rows[0]?.total || 0);
};

export const getTotalMovementsModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `SELECT COUNT(*) AS total FROM movements WHERE ${where};`;
	const rows = await runQuery("getTotalMovementsModel", query, params);
	return Number(rows[0]?.total || 0);
};

export const getTotalBrandsModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `SELECT COUNT(DISTINCT brand) AS total FROM cars WHERE ${where};`;
	const rows = await runQuery("getTotalBrandsModel", query, params);
	return Number(rows[0]?.total || 0);
};

export const getExpensesByTypeModel = async (year, month, categoryType) => {
	const { where, params } = buildTimeWhere(year, month, "created", "m");
	const query = `
		SELECT COALESCE(SUM(m.amount), 0) AS total
		FROM movements m
		INNER JOIN movements_category mc ON mc.category_id = m.movements_category_id
		WHERE mc.type = ? AND ${where};
	`;
	const rows = await runQuery("getExpensesByTypeModel", query, [categoryType, ...params]);
	return Number(rows[0]?.total || 0);
};

export const getInvestorsCountModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `SELECT COUNT(DISTINCT user_id) AS total FROM investor WHERE ${where};`;
	const rows = await runQuery("getInvestorsCountModel", query, params);
	return Number(rows[0]?.total || 0);
};

export const getTotalInvestedModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `SELECT COALESCE(SUM(investment_amount), 0) AS total FROM investor WHERE ${where};`;
	const rows = await runQuery("getTotalInvestedModel", query, params);
	return Number(rows[0]?.total || 0);
};

// ============ CHARTS ============

// Bar: autos vendidos por año (últimos N años desde el año filtrado)
export const getCarsSoldPerYearModel = async (yearsRange, year) => {
	const query = `
		SELECT YEAR(created) AS year, COUNT(*) AS total
		FROM cars
		WHERE status = 'Vendido'
			AND YEAR(created) >= ? - ?
			AND YEAR(created) <= ?
		GROUP BY YEAR(created)
		ORDER BY year ASC;
	`;
	return await runQuery("getCarsSoldPerYearModel", query, [year, yearsRange - 1, year]);
};

// Line: utilidad por año (últimos N años desde el año filtrado)
export const getProfitPerYearModel = async (yearsRange, year) => {
	const query = `
		SELECT YEAR(created) AS year,
			COALESCE(SUM(price_for_sale - purchase_price), 0) AS total
		FROM cars
		WHERE status = 'Vendido'
			AND price_for_sale IS NOT NULL
			AND YEAR(created) >= ? - ?
			AND YEAR(created) <= ?
		GROUP BY YEAR(created)
		ORDER BY year ASC;
	`;
	return await runQuery("getProfitPerYearModel", query, [year, yearsRange - 1, year]);
};

// Area: inversión acumulada por año (running total con window function MySQL 8+)
export const getInvestmentPerYearModel = async (yearsRange, year) => {
	const query = `
		SELECT
			year,
			total,
			SUM(total) OVER (ORDER BY year) AS cumulative
		FROM (
			SELECT YEAR(created) AS year, COALESCE(SUM(investment_amount), 0) AS total
			FROM investor
			WHERE YEAR(created) >= ? - ?
				AND YEAR(created) <= ?
			GROUP BY YEAR(created)
		) AS yearly
		ORDER BY year ASC;
	`;
	return await runQuery("getInvestmentPerYearModel", query, [year, yearsRange - 1, year]);
};

// Horizontal bar: promedio días por marca filtrado por año
export const getAvgDaysToSellByBrandModel = async (year) => {
	const query = `
		SELECT
			brand,
			COUNT(*) AS total_sold,
			ROUND(AVG(DATEDIFF(sale_date, purchase_date)), 1) AS avg_days
		FROM cars
		WHERE status = 'Vendido'
			AND sale_date IS NOT NULL
			AND YEAR(created) <= ?
		GROUP BY brand
		HAVING total_sold >= 2
		ORDER BY avg_days ASC
		LIMIT 10;
	`;
	return await runQuery("getAvgDaysToSellByBrandModel", query, [year]);
};

// Ranking: top autos vendidos (por unidades)
export const getTopSoldCarsModel = async (limit) => {
	const query = `
		SELECT
			brand,
			model,
			year_of_car,
			COUNT(*) AS units,
			COALESCE(SUM(price_for_sale), 0) AS revenue,
			COALESCE(AVG(price_for_sale), 0) AS avg_price,
			COALESCE(SUM(price_for_sale - purchase_price), 0) AS total_profit
		FROM cars
		WHERE status = 'Vendido' AND price_for_sale IS NOT NULL
		GROUP BY brand, model, year_of_car
		ORDER BY units DESC, total_profit DESC
		LIMIT ?;
	`;
	return await runQuery("getTopSoldCarsModel", query, [limit]);
};

// Donut/Pie: utilidad por marca (en periodo filtrado)
export const getProfitByBrandModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `
		SELECT brand, COALESCE(SUM(price_for_sale - purchase_price), 0) AS total_profit
		FROM cars
		WHERE status = 'Vendido' AND price_for_sale IS NOT NULL AND ${where}
		GROUP BY brand
		ORDER BY total_profit DESC;
	`;
	return await runQuery("getProfitByBrandModel", query, params);
};

// Horizontal bar: gastos por categoría + tipo de movimiento
export const getExpensesByCategoryModel = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month, "created", "m");
	const query = `
		SELECT
			mc.name AS category,
			mc.type AS category_type,
			m.type AS movement_type,
			COALESCE(SUM(m.amount), 0) AS total
		FROM movements m
		INNER JOIN movements_category mc ON mc.category_id = m.movements_category_id
		WHERE ${where}
		GROUP BY mc.name, mc.type, m.type
		ORDER BY total DESC;
	`;
	return await runQuery("getExpensesByCategoryModel", query, params);
};

export const getNumberOfCarModels = async (year, month) => {
	const { where, params } = buildTimeWhere(year, month);
	const query = `
		SELECT
			brand,
			COUNT(*) AS total_cars
		FROM cars
		WHERE ${where}
		GROUP BY brand
		ORDER BY total_cars DESC;
	`;
	return await runQuery("getNumberOfCarModels", query, params);
};