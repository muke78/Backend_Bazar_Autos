import Joi from 'joi';

export const schemaInsertInvestorTransaction = Joi.object({
    type: Joi.string().valid("Entrada", "Salida").required(),
    amount: Joi.number()
        .precision(2)
        .positive()
        .required(),
    concept: Joi.string().max(255).allow("", null).optional()
});

export const schemaGetInvestorTransactions = Joi.object({
    year: Joi.number().integer().min(2000).max(2100).optional(),
    month: Joi.number().integer().min(1).max(12).optional(),
    type: Joi.string().valid("Entrada", "Salida").optional(),
});