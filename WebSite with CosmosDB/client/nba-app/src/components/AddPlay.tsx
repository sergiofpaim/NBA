import React, { useState } from 'react';
import { AddPlayParm } from '../types';
import { addPlay } from '../services/api';
import axios from 'axios';

const AddPlay: React.FC = () => {
    const [playerId, setPlayerId] = useState('');
    const [gameId, setGameId] = useState('');
    const [quarter, setQuarter] = useState(1);
    const [playType, setPlayType] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const playData: AddPlayParm = {
            playerId,
            gameId,
            quarter,
            playType
        };

        try {
            await addPlay(playData);
            alert('Play added successfully!');
            setPlayerId('');
            setGameId('');
            setQuarter(1);
            setPlayType(1);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(`Error adding play: ${error.response?.data || error.message}`);
            } else {
                alert('Error adding play: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Player ID"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                required
            />
            <input
                type="number"
                min="1"
                max="4"
                placeholder="Quarter"
                value={quarter}
                onChange={(e) => setQuarter(Number(e.target.value))}
                required
            />
            <input
                type="number"
                placeholder="Play Type"
                value={playType}
                onChange={(e) => setPlayType(Number(e.target.value))}
                required
            />
            <button type="submit">Add Play</button>
        </form>
    );
};

export default AddPlay;