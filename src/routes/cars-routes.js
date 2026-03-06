import express from 'express';
import { methodOK } from "../server/methods-server.js";
import { AuthError } from "../utils/error-utils.js";
import { validationFields } from '../middlewares/validation-middlewares.js';

const cars = express.Router()


export { cars }