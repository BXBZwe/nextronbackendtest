// main/controllers/roomController.js

import pool from '../helpers/db';

const getRooms = async (req, res) => {
    try {
        const result = await pool.query('SELECT room_id, room_number FROM rooms');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: error.message });
    }
};

export { getRooms };
