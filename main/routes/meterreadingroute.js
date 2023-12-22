// main/routes/meterReadingRoutes.js

import express from 'express';
import { addMeterReading } from '../controllers/meterreadingcontroller';

const meterreadingroute = express.Router();

meterreadingroute.post('/api/meter-readings', addMeterReading);

export default meterreadingroute;
