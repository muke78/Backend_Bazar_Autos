import { ForbiddenError } from "../utils/error-utils.js";
import { findUserRole } from "../functions/find-user-role.functions.js";

/**
 * Middleware factory que verifica el rol del usuario autenticado.
 * Debe correr DESPUÉS de verifyToken (req.user.user_id ya está disponible).
 *
 * Express 5 captura automáticamente el throw de funciones async,
 * el errorHandler lo procesa igual que cualquier otro error.
 *
 * @param {...string} roles - Roles permitidos, ej: requireRole('admin')
 *
 * @example
 * // Solo admin
 * router.post('/', verifyToken, requireRole('admin'), handler);
 *
 * // Admin o supervisor
 * router.get('/', verifyToken, requireRole('admin', 'supervisor'), handler);
 */
export const requireRole = (...roles) =>
	async (request, _response, next) => {
		const { user_id } = request.user;

		const user = await findUserRole(user_id);

		if (!user || !roles.includes(user.role)) {
			throw new ForbiddenError(
				"No tienes permisos para acceder a este recurso",
			);
		}

		next();
	};
