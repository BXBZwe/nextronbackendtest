// renderer/pages/meterReadings.jsx or within your existing component file

import React, { useState } from 'react';
import axios from 'axios';

const MeterReadingsForm = () => {
    const [meterReading, setMeterReading] = useState({
        room_id: '',
        water_reading: '',
        electricity_reading: '',
        reading_date: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeterReading({ ...meterReading, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/meter-readings', meterReading);
            console.log(response.data);
            // Handle success (clear form, show message, etc.)
        } catch (error) {
            console.error('Error submitting meter readings:', error);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                name="room_id"
                value={meterReading.room_id}
                onChange={handleInputChange}
                placeholder="Room ID"
                required
            />
            <input
                type="number"
                name="water_reading"
                value={meterReading.water_reading}
                onChange={handleInputChange}
                placeholder="Water Meter Reading"
                required
            />
            <input
                type="number"
                name="electricity_reading"
                value={meterReading.electricity_reading}
                onChange={handleInputChange}
                placeholder="Electricity Meter Reading"
                required
            />
            <input
                type="date"
                name="reading_date"
                value={meterReading.reading_date}
                onChange={handleInputChange}
                required
            />
            <button type="submit">Submit Meter Readings</button>
        </form>
    );
};

export default MeterReadingsForm;
