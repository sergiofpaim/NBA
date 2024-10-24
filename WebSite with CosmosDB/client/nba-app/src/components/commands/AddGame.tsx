import React, { useState } from 'react';
import { AddGameParm } from '../../types';
import { addGame } from '../../services/api';
import axios from 'axios';

const AddGame: React.FC = () => {
    const [homeTeamId, setHomeId] = useState('');
    const [visitorTeamId, setVisitorId] = useState('');
    const [at, setAt] = useState<Date>(new Date());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const gameData: AddGameParm = {
            homeTeamId,
            visitorTeamId,
            at,
        };

        try {
            await addGame(gameData);
            alert('Game added successfully!');
            setHomeId('');
            setVisitorId('');
            setAt(new Date());
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(`Error adding game: ${error.response?.data || error.message}`);
            } else {
                alert('Error adding game: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        }
    };

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDateTime = e.target.value;
        setAt(new Date(selectedDateTime));
    };

    const formatDateToLocalInput = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
        return localISOTime;
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Home Team ID"
                value={homeTeamId}
                onChange={(e) => setHomeId(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Visitor Team ID"
                value={visitorTeamId}
                onChange={(e) => setVisitorId(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                value={formatDateToLocalInput(at)}
                onChange={handleDateTimeChange}
                required
            />
            <button type="submit">Add Game</button>
        </form>
    );
};

export default AddGame;
