import nodemailer from 'nodemailer';
import pool from '../helpers/db';
import { getRooms } from './roomcontroller';

const Emailsender = async (req, res) => {
    console.log("Emailsender function called");
    console.log("Request body:", req.body);

    const { to, subject, message, room_id } = req.body; // Destructure 'to' and 'subject' from req.body

    try {
        //console.log("Fetching bill details for room ID:", room_id);
        const query = `
            SELECT r.room_number, b.*
            FROM rooms r
            JOIN bills b ON r.room_id = b.room_id
            WHERE r.room_id = $1
            ORDER BY b.bill_date DESC
            LIMIT 1
        `;

        const { rows } = await pool.query(query, [room_id]);
        if (rows.length === 0) {
            console.log("No bill details found for room ID:", room_id);
            return res.status(404).json({ message: 'No bill details found for the specified room ID.' });
        }

        const { room_number, water_usage, electricity_usage, water_cost, electricity_cost, additional_rates_cost, total_amount } = rows[0];

        // Format the email content with bill details and the additional message
        const emailContent = `${message}\n\nBill Details for Room Number: ${room_number}
        \nWater Usage: ${water_usage}
        \nElectricity Usage: ${electricity_usage}
        \nWater Cost: ${water_cost}
        \nElectricity Cost: ${electricity_cost}
        \nAdditional Rates Cost: ${additional_rates_cost}
        \nTotal Bill Amount: ${total_amount}`;
        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'legendaryzwe@gmail.com', // Make sure these credentials are secured
                pass: 'pjwz jjsw ixxc mtkz'
            }
        });

        console.log("Sending email to:", to);
        // Send email
        await transporter.sendMail({
            from: 'legendaryzwe@gmail.com',
            to: to,
            subject: subject,
            text: emailContent,
        });

        console.log("Email sent successfully to:", to);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (e) {
        console.error("Error in Emailsender:", e);
        res.status(500).json({ error: e.message });
    }
};

export { Emailsender };
