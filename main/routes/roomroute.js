// main/routes/roomRoutes.js

import express from 'express';
import {getRooms} from '../controllers/roomcontroller';

const router = express.Router();

router.get('/api/rooms', getRooms);

export default router;
