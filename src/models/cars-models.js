import { connectionQuery } from "../helpers/index.js";
import { DatabaseError } from "../utils/error-utils.js";

export const getModelsFromDBCarsModel = async () => {
    try {
        const query = `
            SELECT 
                MIN(car_id) AS id, model AS name
            FROM
                cars
            GROUP BY model
            ORDER BY model ASC;
        `;

        const rows = await connectionQuery(query);
        return rows;
    } catch (error) {
        throw new DatabaseError("Error al obtener los modelos de la base de datos", {
            context: "getModelsFromDBCarsModel",
            metadata: { originalError: error.message }
        });
    }
};