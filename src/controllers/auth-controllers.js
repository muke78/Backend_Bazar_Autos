import { loginService } from "../services/auth-services.js";

export const Login = (userData) => loginService(userData);
