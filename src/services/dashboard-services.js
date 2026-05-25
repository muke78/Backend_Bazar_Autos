import {
	getTotalSalesModel,
	getTotalProfitModel,
	getTotalMovementsModel,
	getTotalBrandsModel,
	getExpensesByTypeModel,
	getInvestorsCountModel,
	getTotalInvestedModel,
	getCarsSoldPerYearModel,
	getProfitPerYearModel,
	getInvestmentPerYearModel,
	getTopSoldCarsModel,
	getAvgDaysToSellByBrandModel,
	getProfitByBrandModel,
	getExpensesByCategoryModel,
	getNumberOfCarModels,
} from "../models/dashboard-models.js";
import { memoize } from "../lib/cache.js";

// TTL del cache de dashboard — 60s es buen trade-off para datos casi-realtime
const DASHBOARD_CACHE_TTL_MS = 60_000;

const computeChange = (current, previous) => {
	if (!previous || previous === 0) {
		return current > 0 ? 100 : 0;
	}
	return Number((((current - previous) / previous) * 100).toFixed(2));
};

const getPreviousPeriod = (year, month) => {
	if (month) {
		if (month === 1) return { year: year - 1, month: 12 };
		return { year, month: month - 1 };
	}
	return { year: year - 1, month: null };
};

const buildDashboard = async (currentYear, currentMonth, yearsRange, topLimit) => {
	const prev = getPreviousPeriod(currentYear, currentMonth);

	// Todas las queries en paralelo
	const [
		totalSales,
		prevSales,
		totalProfit,
		prevProfit,
		totalMovements,
		totalBrands,
		activeExpenses,
		prevActiveExpenses,
		passiveExpenses,
		prevPassiveExpenses,
		investorsCount,
		totalInvested,
		prevInvested,
		carsSoldPerYear,
		profitPerYear,
		investmentPerYear,
		topCars,
		avgDaysByBrand,
		profitByBrand,
		expensesByCategory,
		carsByBrand,
	] = await Promise.all([
		getTotalSalesModel(currentYear, currentMonth),
		getTotalSalesModel(prev.year, prev.month),
		getTotalProfitModel(currentYear, currentMonth),
		getTotalProfitModel(prev.year, prev.month),
		getTotalMovementsModel(currentYear, currentMonth),
		getTotalBrandsModel(currentYear, currentMonth),
		getExpensesByTypeModel(currentYear, currentMonth, "Activo"),
		getExpensesByTypeModel(prev.year, prev.month, "Activo"),
		getExpensesByTypeModel(currentYear, currentMonth, "Pasivo"),
		getExpensesByTypeModel(prev.year, prev.month, "Pasivo"),
		getInvestorsCountModel(currentYear, currentMonth),
		getTotalInvestedModel(currentYear, currentMonth),
		getTotalInvestedModel(prev.year, prev.month),
		getCarsSoldPerYearModel(yearsRange, currentYear),
		getProfitPerYearModel(yearsRange, currentYear),
		getInvestmentPerYearModel(yearsRange, currentYear),
		getTopSoldCarsModel(topLimit),
		getAvgDaysToSellByBrandModel(currentYear),
		getProfitByBrandModel(currentYear, currentMonth),
		getExpensesByCategoryModel(currentYear, currentMonth),
		getNumberOfCarModels(currentYear, currentMonth)
	]);

	return {
		filters: {
			year: currentYear,
			month: currentMonth,
			years_range: yearsRange,
			top_limit: topLimit,
			previous_period: prev,
		},
		kpis: {
			total_sales: {
				value: totalSales,
				previous: prevSales,
				change_pct: computeChange(totalSales, prevSales),
				label: "Ventas Totales",
			},
			total_profit: {
				value: totalProfit,
				previous: prevProfit,
				change_pct: computeChange(totalProfit, prevProfit),
				label: "Utilidad Año Actual",
			},
			total_movements: {
				value: totalMovements,
				label: "Total Movimientos",
				hint: "entradas + salidas",
			},
			total_brands: {
				value: totalBrands,
				label: "Marcas en Catálogo",
				hint: "únicas registradas",
			},
			active_expenses: {
				value: activeExpenses,
				previous: prevActiveExpenses,
				change_pct: computeChange(activeExpenses, prevActiveExpenses),
				label: "Gastos Activos",
				hint: "recuperables",
			},
			passive_expenses: {
				value: passiveExpenses,
				previous: prevPassiveExpenses,
				change_pct: computeChange(passiveExpenses, prevPassiveExpenses),
				label: "Gastos Pasivos",
				hint: "no recuperables",
			},
			investors_count: {
				value: investorsCount,
				label: "Inversionistas",
				hint: "cuentas activas",
			},
			total_invested: {
				value: totalInvested,
				previous: prevInvested,
				change_pct: computeChange(totalInvested, prevInvested),
				label: "Capital Invertido",
				hint: "total acumulado",
			},
		},
		charts: {
			cars_sold_per_year: {
				type: "bar",
				title: "Autos vendidos por año",
				subtitle: "Unidades movidas por período anual",
				data: carsSoldPerYear.map((r) => ({
					year: Number(r.year),
					total: Number(r.total),
				})),
			},
			profit_per_year: {
				type: "line",
				title: "Utilidad por año",
				subtitle: "Tendencia de utilidad neta",
				data: profitPerYear.map((r) => ({
					year: Number(r.year),
					total: Number(r.total),
				})),
			},
			investment_per_year: {
				type: "area",
				title: "Inversión total por año",
				subtitle: "Capital acumulado de inversionistas",
				data: investmentPerYear.map((r) => ({
					year: Number(r.year),
					total: Number(r.total),
					cumulative: Number(r.cumulative),
				})),
			},
			top_sold_cars: {
				type: "ranking",
				title: `Top ${topLimit} autos vendidos`,
				subtitle: "Mejores modelos por unidades vendidas",
				data: topCars.map((r) => ({
					brand: r.brand,
					model: r.model,
					year: Number(r.year_of_car),
					units: Number(r.units),
					revenue: Number(r.revenue),
					avg_price: Number(r.avg_price),
					total_profit: Number(r.total_profit),
				})),
			},
			avg_days_to_sell_by_brand: {
				type: "horizontal_bar",
				title: "Velocidad de venta por marca",
				subtitle: "Promedio de días que tarda en venderse cada marca",
				data: avgDaysByBrand.map((r) => ({
					brand: r.brand,
					total_sold: Number(r.total_sold),
					avg_days: Number(r.avg_days),
				})),
			},
			profit_by_brand: {
				type: "donut",
				title: "Utilidad por marca",
				subtitle: "Distribución de utilidad por marca en el período",
				data: profitByBrand.map((r) => ({
					brand: r.brand,
					total_profit: Number(r.total_profit),
				})),
			},
			expenses_by_category: {
				type: "horizontal_bar",
				title: "Gastos por categoría",
				subtitle: "Desglose de movimientos por categoría",
				data: expensesByCategory.map((r) => ({
					category: r.category,
					category_type: r.category_type,
					movement_type: r.movement_type,
					total: Number(r.total),
				})),
			},
			cars_by_brand: {
				type: "bar",
				title: "Autos en catálogo por marca",
				subtitle: "Conteo de autos registrados por marca en el período",
				data: carsByBrand.map((r) => ({
					brand: r.brand,
					total: Number(r.total_cars),
				})),
			},
		},
	};
};

/**
 * Service público — wraps buildDashboard con cache TTL.
 * Misma combinación de filtros = misma key → resultado servido desde memoria.
 * Reduce 21 queries paralelas a 0 en cache hit.
 */
export const getDashboardService = async ({
	year,
	month,
	years_range,
	top_limit,
}) => {
	const now = new Date();
	const currentYear = year || now.getFullYear();
	const currentMonth = month || null;
	const yearsRange = years_range || 6;
	const topLimit = top_limit || 3;

	const cacheKey = `dash:${currentYear}:${currentMonth ?? "all"}:${yearsRange}:${topLimit}`;

	return memoize(
		cacheKey,
		() => buildDashboard(currentYear, currentMonth, yearsRange, topLimit),
		DASHBOARD_CACHE_TTL_MS,
	);
};
