import { ApiService } from './api-service.js';
import dotenv from 'dotenv';
dotenv.config();

export const apiService = new ApiService(process.env.API_URL);
