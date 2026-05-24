import { getDashboardService } from "../services/dashboard-services.js";

export const GetDashboard = async (filters) => {
	return await getDashboardService(filters);
};
