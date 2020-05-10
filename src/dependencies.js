import dotenv from 'dotenv';
import { ApiService } from './api-service.js';

dotenv.config();

export const apiService = new ApiService(process.env.API_URL);
