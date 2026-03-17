import { postInsertInvestorService } from "../services/investor-service.js";

export const InsertInvestor = async (investorData) => {
	const postInvestor = await postInsertInvestorService(investorData);
	return postInvestor;
};
