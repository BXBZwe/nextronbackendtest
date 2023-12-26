import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addMeterReading = async (req, res) => {
    const { room_id, water_reading, electricity_reading, reading_date } = req.body;

    try {
        // Parse water_reading and electricity_reading to integers
        const waterReadingInt = parseInt(water_reading);
        const electricityReadingInt = parseInt(electricity_reading);

        // Check for valid integer parsing
        if (isNaN(waterReadingInt) || isNaN(electricityReadingInt)) {
            return res.status(400).json({ message: 'Invalid meter reading values.' });
        }

        await prisma.meter_readings.create({
            data: {
                room_id: parseInt(room_id), // Assuming room_id is an integer
                water_reading: waterReadingInt,
                electricity_reading: electricityReadingInt,
                reading_date: new Date(reading_date), // Convert to Date object
            },
        });

        res.status(200).json({ message: 'Meter reading added successfully' });
    } catch (error) {
        console.error('Error in addMeterReading:', error);
        res.status(500).json({ error: error.message });
    }
};

export { addMeterReading };
