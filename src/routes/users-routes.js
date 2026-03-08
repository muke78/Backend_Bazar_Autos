import express from 'express';
import { verifyToken } from '../middlewares/verify-jwt-middlewares.js';
import { GetFullNameUser, GetProfile } from '../controllers/users-controllers.js';
import { methodOK } from '../server/methods-server.js';


const users = express.Router()

users.get("/", verifyToken, async (request, response, next) => {
    try {
        const result = await GetFullNameUser();
        methodOK(request, response, result)
    } catch (error) {
        next(error)
    }
})

// GET /api/users/profile
users.get("/profile", verifyToken, async (request, response, next) => {
    try {
        const { user_id } = request.user;
        const result = await GetProfile(user_id);
        methodOK(request, response, result);
    } catch (error) {
        next(error);
    }
});

export { users }