// main/controllers/meterReadingController.js

import pool from '../helpers/db';

const addMeterReading = async (req, res) => {
    const { room_id, water_reading, electricity_reading, reading_date } = req.body;

    try {
        await pool.query(
            'INSERT INTO meter_readings (room_id, water_reading, electricity_reading, reading_date) VALUES ($1, $2, $3, $4)',
            [room_id, water_reading, electricity_reading, reading_date]
        );
        res.status(200).json({ message: 'Meter reading added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { addMeterReading };
