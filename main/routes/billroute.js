// main/routes/billRoutes.js

import express from 'express';
import { calculateBill } from '../controllers/billcontroller';

const billroute = express.Router();

billroute.post('/api/calculate-bill', calculateBill);

export default billroute;
