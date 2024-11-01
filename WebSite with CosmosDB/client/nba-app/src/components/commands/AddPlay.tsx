import React, { useState } from 'react';
import { AddPlayParm } from '../../types';
import { addPlay } from '../../services/api';
import axios from 'axios';
import { Box, Button, TextField } from '@mui/material';

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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Player ID"
                variant="filled"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                required
            />
            <TextField
                label="Game ID"
                variant="outlined"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                required
            />
            <TextField
                label="Quarter"
                type="number"
                variant="filled"
                value={quarter}
                onChange={(e) => setQuarter(Number(e.target.value))}
                required
            />
            <TextField
                label="Play Type"
                type="number"
                variant="filled"
                value={playType}
                onChange={(e) => setPlayType(Number(e.target.value))}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Add Play
            </Button>
        </Box>
    );
};

export default AddPlay;