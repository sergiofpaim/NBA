import React, { useState } from 'react';
import { AddGameParm } from '../../types';
import { addGame } from '../../services/api';
import axios from 'axios';
import { Box, Button, TextField } from '@mui/material';

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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Home Team ID"
                variant="filled"
                value={homeTeamId}
                onChange={(e) => setHomeId(e.target.value)}
                required
            />
            <TextField
                label="Visitor Team ID"
                variant="filled"
                value={visitorTeamId}
                onChange={(e) => setVisitorId(e.target.value)}
                required
            />
            <TextField
                label="Game Date and Time"
                type="datetime-local"
                variant="filled"
                value={formatDateToLocalInput(at)}
                onChange={handleDateTimeChange}
                required
                sx={{ mt: 1 }}
            />
            <Button type="submit" variant="contained" color="primary">
                Add Game
            </Button>
        </Box>
    );
};

export default AddGame;
