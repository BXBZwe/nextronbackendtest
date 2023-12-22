// renderer/pages/BillCalculationForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const BillCalculationForm = () => {
    const [roomId, setRoomId] = useState('');
    const [billDetails, setBillDetails] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/calculate-bill', { room_id: roomId });
            setBillDetails(response.data.billDetails);
        } catch (error) {
            console.error('Error calculating bill:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Room ID"
                    required
                />
                <button type="submit">Calculate Bill</button>
            </form>

            {billDetails && (
                <div>
                    <p>Room ID: {billDetails.room_id}</p>
                    <p>Water Usage: {billDetails.water_usage}</p>
                    <p>Electricity Usage: {billDetails.electricity_usage}</p>
                    <p>Water Cost: {billDetails.water_cost}</p>
                    <p>Electricity Cost: {billDetails.electricity_cost}</p>
                    <p>Additional Rates Cost: {billDetails.additional_rates_cost}</p>
                    <p>Total Bill Amount: {billDetails.total_amount}</p>
                </div>
            )}
        </div>
    );
};

export default BillCalculationForm;
