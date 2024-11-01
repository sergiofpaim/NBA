import React, { useState } from 'react';
import { ListPlayParms, Play } from '../../types';
import { listPlay } from '../../services/api';
import { Box, Button, Card, CardContent, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';

const ListPlay: React.FC = () => {
    const [playerId, setPlayerId] = useState('');
    const [gameId, setGameId] = useState('');
    const [plays, setPlays] = useState<Play[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const listData: ListPlayParms = {
            playerId,
            gameId,
        };

        console.log('Parameters:', listData);

        try {
            const result = await listPlay(listData);
            console.log('Plays fetched:', result);
            setPlays(result);
        } catch (err) {
            console.error(err);
        }

        setPlayerId('');
        setGameId('');
    };

    return (
        <div>
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
                    variant="filled"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>

            {plays.length > 0 && (
                <Card sx={{ marginTop: 3 }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Plays List
                        </Typography>
                        <List>
                            {plays.map((play, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`Quarter: ${play.quarter}`}
                                        secondary={`Type: ${play.type}, Points: ${play.points}, Time: ${play.at}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ListPlay;