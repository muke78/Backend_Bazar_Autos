import {
	GetTransactionsService,
	InsertTransactionService,
} from "../services/transactions-services.js";

export const GetTransactions = async (investor_id, filters) => {
	const getTransactions = await GetTransactionsService(investor_id, filters);
	return getTransactions;
};

export const InsertTransaction = async (investor_id, transactionData) => {
	const insertTransaction = await InsertTransactionService(
		investor_id,
		transactionData,
	);
	return insertTransaction;
};
