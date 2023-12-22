import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeterReadingsForm from './meterreading';
import BillCalculationForm from './billcalculation';

const testnextron = () => {
    const [email, setEmail] = useState({ to: '', subject: '', message: '' });
    const [responseMessage, setResponseMessage] = useState('No message found');
    const [currentPage, setCurrentPage] = useState('home');
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        window.ipc.on('reply-message', (message) => {
            setResponseMessage(message);
        });
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/rooms'); // Adjust URL as needed
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleInputChange = (e) => {
        setEmail({ ...email, [e.target.name]: e.target.value });
    };

    const handleRoomChange = (e) => {
        setEmail({ ...email, room_id: e.target.value });
    };

    const handleSubmit = () => {
        axios.post('http://localhost:3000/send-email', email)
            .then(response => setResponseMessage(response.data.message))
            .catch(error => console.error('Error sending email:', error));
    };

    return (
        <div>
            <div>
                <button onClick={() => setCurrentPage('home')}>Home</button>
                <button onClick={() => setCurrentPage('meterReading')}>Meter Reading</button>
                <button onClick={() => setCurrentPage('billCalculation')}>Bill Calculation</button>

                {currentPage === 'home' && (
                    <div>
                        <input
                            type="email"
                            name="to"
                            placeholder="Recipient's Email"
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="message"
                            placeholder="Message"
                            onChange={handleInputChange}
                        />
                        <select onChange={handleRoomChange} value={email.room_id}>
                            <option value="">Select Room</option>
                            {rooms.map(room => (
                                <option key={room.room_id} value={room.room_id}>
                                    Room {room.room_number}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleSubmit}>Send Email</button>
                        <p>{responseMessage}</p>
                    </div>
                )}
                {currentPage === 'meterReading' && <MeterReadingsForm />}
                {currentPage === 'billCalculation' && <BillCalculationForm />}
            </div>
        </div>
    );
};

export default testnextron;