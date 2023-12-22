// main/controllers/billController.js

// ... other imports
import pool from '../helpers/db';

const calculateBill = async (req, res) => {
    const { room_id } = req.body;
    console.log("Request body:", req.body);

    try {
        // Fetch previous and current meter readings
        const readings = await pool.query(
            'SELECT * FROM meter_readings WHERE room_id = $1 ORDER BY reading_date DESC LIMIT 2',
            [room_id]
        );

        if (readings.rowCount < 2) {
            throw new Error('Insufficient meter readings to calculate bill.');
        }

        const [currentReading, previousReading] = readings.rows;

        // Calculate usage
        const waterUsage = Math.abs(currentReading.water_reading - previousReading.water_reading);
        const electricityUsage = Math.abs(currentReading.electricity_reading - previousReading.electricity_reading);

        // Fetch rates for water and electricity
        // Assuming rate_id 1 is water and rate_id 2 is electricity in your rates table

        const waterRateId = 6; // Replace with actual ID for water
        const electricityRateId = 7;
        const rates = await pool.query('SELECT * FROM rates WHERE rate_id IN ($1, $2)', [waterRateId, electricityRateId]);
        const waterRate = rates.rows.find(rate => rate.rate_id === waterRateId).item_price;
        const electricityRate = rates.rows.find(rate => rate.rate_id === electricityRateId).item_price;
    

        // Calculate cost
        const waterCost = waterUsage * waterRate;
        const electricityCost = electricityUsage * electricityRate;
        // Fetch additional rate items for the room
        const roomRates = await pool.query(
            'SELECT r.rate_id, r.item_price, rr.quantity FROM rates r INNER JOIN room_rates rr ON r.rate_id = rr.rate_id WHERE rr.room_id = $1',
            [room_id]
        );

        // Calculate the cost of additional rate items
        let additionalRatesCost = 0;
        roomRates.rows.forEach(rate => {
            additionalRatesCost += rate.item_price * rate.quantity;
        });

        // Calculate total bill
        const totalBill = waterCost + electricityCost + additionalRatesCost;

        // Insert bill into the database
        const insertedBill = await pool.query(
            'INSERT INTO bills (room_id, water_usage, electricity_usage, water_cost, electricity_cost, additional_rates_cost, total_amount, bill_date) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE) RETURNING *',
            [room_id, waterUsage, electricityUsage, waterCost, electricityCost, additionalRatesCost, totalBill]
        );

        // const detailedBill = {
        //     room_id: room_id,
        //     water_usage: waterUsage,
        //     electricity_usage: electricityUsage,
        //     water_cost: waterCost,
        //     electricity_cost: electricityCost,
        //     additional_rates_cost: additionalRatesCost,
        //     total_amount: totalBill
        // };

        res.json({ billDetails: insertedBill.rows[0] });
    } catch (error) {
        console.error('Error in calculateBill:', error); // Log the error
        res.status(500).json({ error: error.message });
    }
};

export { calculateBill };
