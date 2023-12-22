// // app/server.js
// import express from 'express';
// import cors from 'cors';
// import nodemailer from 'nodemailer';
// import pool from './helpers/db';

// const app = express();
// app.use(express.json());


// async function fetchDataForEmail() {
//     try {
//         const { rows } = await pool.query('SELECT * FROM todos ORDER BY id ASC');
//         // Format the data for email. This is a simple example.
//         return rows.map(row => `${row.id}: ${row.task} - ${row.completed}`).join('\n');
//     } catch (e) {
//         throw e;
//     }
// }


// var whitelist = ['http://localhost:8888', 'app://.'];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true //important for cookies/session information
// };

// app.use(cors(corsOptions));


// app.post('/send-email', async (req, res) => {
//     const emailData = req.body;
//     try {
//         const todoData = await fetchDataForEmail();
//         const emailContent = `${emailData.message}\n\nTodo Data:\n${todoData}`;
//         // Set up Nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'legendaryzwe@gmail.com',
//               pass: 'pjwz jjsw ixxc mtkz'
//             }
//           });

//         // Send email
//         await transporter.sendMail({
//             from: 'legendaryzwe@gmail.com',
//             to: emailData.to,
//             subject: emailData.subject,
//             text: emailContent,
//         });

//         res.status(200).json({ message: 'Email sent successfully' });
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

// // Get all todos
// app.get('/api/todo', async (req, res) => {
//     try {
//         const { rows } = await pool.query('SELECT * FROM todos ORDER BY id ASC');
//         res.status(200).json(rows);
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

// // Add a new todo
// app.post('/api/todo', async (req, res) => {
//     try {
//         const { task } = req.body;
//         const { rows } = await pool.query('INSERT INTO todos(task) VALUES($1) RETURNING *', [task]);
//         res.status(201).json(rows[0]);
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

// // Update an existing todo
// app.put('/api/todo', async (req, res) => {
//     try {
//         const { id, task, completed } = req.body;
//         const { rows } = await pool.query('UPDATE todos SET task = $2, completed = $3 WHERE id = $1 RETURNING *', [id, task, completed]);
//         res.status(200).json(rows[0]);
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

// // Delete a todo
// app.delete('/api/todo', async (req, res) => {
//     try {
//         const { id } = req.body;
//         await pool.query('DELETE FROM todos WHERE id = $1', [id]);
//         res.status(204).end();
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

// export default function startServer() {
//     const port = 3000; 
//     app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//     });
//   };

// main/controllers/billController.js

// import {pool} from '../helpers/db';

// const calculateBill = async (req, res) => {
//     const { room_id } = req.body;

//     try {
//         // Fetch previous and current meter readings
//         const readings = await pool.query(
//             'SELECT * FROM meter_readings WHERE room_id = $1 ORDER BY reading_date DESC LIMIT 2',
//             [room_id]
//         );

//         if (readings.rowCount < 2) {
//             throw new Error('Insufficient meter readings to calculate bill.');
//         }

//         const [currentReading, previousReading] = readings.rows;

//         // Calculate usage
//         const waterUsage = currentReading.water_reading - previousReading.water_reading;
//         const electricityUsage = currentReading.electricity_reading - previousReading.electricity_reading;

//         // Fetch rates for water and electricity
//         // Assuming rate_id 1 is water and rate_id 2 is electricity in your rates table
//         const rates = await pool.query('SELECT * FROM rates WHERE rate_id IN (1, 2)');
//         const waterRate = rates.rows.find(rate => rate.rate_id === 1).item_price;
//         const electricityRate = rates.rows.find(rate => rate.rate_id === 2).item_price;

//         // Calculate cost
//         const waterCost = waterUsage * waterRate;
//         const electricityCost = electricityUsage * electricityRate;

//         // Calculate total bill (add other costs if applicable)
//         const totalBill = waterCost + electricityCost;

//         // Insert bill into the database and return the result
//         const insertedBill = await pool.query(
//             'INSERT INTO bills (room_id, water_usage, electricity_usage, bill_date, total_amount) VALUES ($1, $2, $3, CURRENT_DATE, $4) RETURNING *',
//             [room_id, waterUsage, electricityUsage, totalBill]
//         );

//         res.json({ billDetails: insertedBill.rows[0] });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export { calculateBill };


// app.post('/send-email', async (req, res) => {
//     const emailData = req.body;
//     try {
//         const emailContent = `${emailData.message}`;
//         // Set up Nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'legendaryzwe@gmail.com',
//               pass: 'pjwz jjsw ixxc mtkz'
//             }
//           });

//         // Send email
//         await transporter.sendMail({
//             from: 'legendaryzwe@gmail.com',
//             to: emailData.to,
//             subject: emailData.subject,
//             text: emailContent,
//         });

//         res.status(200).json({ message: 'Email sent successfully' });
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });