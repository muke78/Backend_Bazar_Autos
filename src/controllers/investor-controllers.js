import { getInvestmentsService, postInsertInvestorService } from "../services/investor-service.js";

export const GetInvestmentsByUser = async (user_id, filters) => {
	const investments = await getInvestmentsService(user_id, filters);
	return investments;
};

export const InsertInvestor = async (investorData) => {
	const postInvestor = await postInsertInvestorService(investorData);
	return postInvestor;
};
