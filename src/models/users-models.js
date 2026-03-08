import { connectionQuery } from "../helpers/index.js";

export const listGetFullNameUserModels = async () => {
    try {
        const query = `SELECT full_name FROM users;`
        return await connectionQuery(query)
    } catch (error) {
        throw new DatabaseError("Error al obtener los modelos de la base de datos", {
            context: "getModelsFromDBCarsModel",
            metadata: { originalError: error.message }
        });
    }
};

export const listProfileModel = async (user_id) => {
    try {
        const query = `SELECT 
                        user_id,
                        username,
                        full_name,
                        email,
                        last_login,
                        created,
                        updated
                    FROM users
                    WHERE user_id = ?;`;
        const params = [user_id];
        return await connectionQuery(query, params);
    } catch (error) {
        throw new DatabaseError("Error al obtener los modelos de la base de datos", {
            context: "getModelsFromDBCarsModel",
            metadata: { originalError: error.message }
        });
    }

};