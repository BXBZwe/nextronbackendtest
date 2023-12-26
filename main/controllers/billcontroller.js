import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const calculateBill = async (req, res) => {
    const { room_id } = req.body;
    console.log("Request body:", req.body);

    try {
        // Fetch previous and current meter readings
        const meter_readings = await prisma.meter_readings.findMany({
            where: {
                room_id: parseInt(room_id),
            },
            orderBy: {
                reading_date: 'desc',
            },
            take: 2,
        });

        if (meter_readings.length < 2) {
            throw new Error('Insufficient meter readings to calculate bill.');
        }

        const [currentReading, previousReading] = meter_readings;

        // Calculate usage
        const waterUsage = Math.abs(currentReading.water_reading - previousReading.water_reading);
        const electricityUsage = Math.abs(currentReading.electricity_reading - previousReading.electricity_reading);

        // Fetch rates for water and electricity
        const waterRateId = 6; // Replace with actual ID for water
        const electricityRateId = 7;

        const rates = await prisma.rates.findMany({
            where: {
                rate_id: {
                    in: [waterRateId, electricityRateId],
                },
            },
        });

        const waterRate = rates.find(rates => rates.rate_id === waterRateId).item_price;
        const electricityRate = rates.find(rates => rates.rate_id === electricityRateId).item_price;

        // Calculate cost
        const waterCost = waterUsage * waterRate;
        const electricityCost = electricityUsage * electricityRate;

        // Fetch additional rate items for the room
        const room_rates = await prisma.room_rates.findMany({
            where: {
                room_id: parseInt(room_id),
            },
            include: {
                rates: true,
            },
        });

        // Calculate the cost of additional rate items
        let additionalRatesCost = room_rates.reduce((acc, item) => {
            return acc + (item.rates.item_price * item.quantity);
        }, 0);

        // Calculate total bill
        const totalBill = waterCost + electricityCost + additionalRatesCost;

        // Insert bill into the database
        const insertedBill = await prisma.bills.create({
            data: {
                room_id: parseInt(room_id),
                water_usage: waterUsage,
                electricity_usage: electricityUsage,
                water_cost: waterCost,
                electricity_cost: electricityCost,
                additional_rates_cost: additionalRatesCost,
                total_amount: totalBill,
                bill_date: new Date(), // Using the current date
            },
        });

        res.json({ billDetails: insertedBill });
    } catch (error) {
        console.error('Error in calculateBill:', error);
        res.status(500).json({ error: error.message });
    }
};

export { calculateBill };
