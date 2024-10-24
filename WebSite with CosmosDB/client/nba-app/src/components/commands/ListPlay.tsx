import React, { useState } from 'react';
import { ListPlayParms, Play } from '../../types';
import { listPlay } from '../../services/api';

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
                <button type="submit">List Plays</button>
            </form>
            <div>
                {plays.length > 0 && (
                    <ul>
                        {plays.map((play, index) => (
                            <li key={index}>
                                Quarter: {play.quarter}, Type: {play.type}, Points: {play.points}, Time: {play.at}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ListPlay;