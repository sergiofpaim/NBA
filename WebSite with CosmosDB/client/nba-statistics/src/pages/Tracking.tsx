
import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import Button from '../components/Button';
import { addPlay, fetchParticipation, fetchPlayers, fetchTeams, setCurrentGame, setCurrentPlayerOfGame } from '../stores/Transaction';
import { useParams } from 'react-router-dom';
import List from '../components/ItemsList';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { fetchGames } from '../stores/Transaction';
import { fetchSeasons } from '../stores/Selection';

const TrackingPage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();

    const { gameId } = useParams<{ gameId: string }>();
    const { playerId } = useParams<{ playerId: string }>();

    const seasons = useSelector((state: RootState) => state.seasons.seasons);
    const games = useSelector((state: RootState) => state.transactionGames.games);
    const teams = useSelector((state: RootState) => state.transactionTeams.teams);
    const playersParticipating = useSelector((state: RootState) => state.transactionPlayers.players);
    const participation = useSelector((state: RootState) => state.transactionParticipation.participation);

    const currentParticipation = useSelector((state: RootState) => state.transactionPlayers.currentPlayer);
    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);

    const [playerName, setPlayerName] = useState<string>('');
    const [quarter, setQuarter] = useState(1);

    function handleEditPlay(): void {
        throw new Error('Function not implemented.');
    }

    const handleIncreaseQuarter = () => {
        setQuarter(prevQuarter => prevQuarter + 1);
    };

    const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

    const handleAddPlay = (type: string) => {
        if (!gameId || !playerId) return;

        const payload = {
            gameId,
            playerId,
            quarter: quarter,
            type,
        };

        dispatch(addPlay(payload));

        setTimeout(() => {
            dispatch(fetchPlayers({ gameId }));
        }, 500);
    };

    const playTypes = [
        'FreeThrowHit',
        'TwoPointerHit',
        'ThreePointerHit',
        'FreeThrowMiss',
        'TwoPointerMiss',
        'ThreePointerMiss',
        'Assist',
        'Rebound',
        'Turnover',
        'Block',
        'Foul',
    ];

    useEffect(() => {
        dispatch(fetchSeasons());
        dispatch(fetchGames());
    }, [dispatch, gameId]);

    useEffect(() => {
        if (seasons.length > 0) {
            dispatch(fetchTeams({ seasonId: seasons[seasons.length - 1].id }));
        }
    }, [dispatch, seasons]);

    useEffect(() => {
        if (games && gameId) {
            dispatch(setCurrentGame(games.find(game => game.id === gameId)));
        }
    }, [dispatch, games, gameId]);

    useEffect(() => {
        dispatch(fetchPlayers({ gameId: gameId ?? "" }));
    }, [dispatch, gameId]);

    useEffect(() => {
        if (playersParticipating)
            dispatch(setCurrentPlayerOfGame(playersParticipating.find(p => p.playerId === playerId)));
    }, [dispatch, playersParticipating, playerId]);

    useEffect(() => {
        if (gameId && playerId)
            dispatch(fetchParticipation({ gameId: gameId, playerId: playerId }));
    }, [dispatch, playerId, gameId]);

    useEffect(() => {
        if (currentGame && teams.length > 0) {
            const homeTeam = teams.find(team => team.teamId === currentGame.homeTeamId);
            const visitorTeam = teams.find(team => team.teamId === currentGame.visitorTeamId);
            if (homeTeam && visitorTeam) {
                const playersOfTheCurrentGame = [
                    ...(homeTeam.players || []),
                    ...(visitorTeam.players || []),
                ];
                const player = playersOfTheCurrentGame.find(p => p.playerId === playerId);
                if (player) {
                    setPlayerName(player.playerName || '');
                }
            }
        }
    }, [teams, currentGame, playerId]);

    useEffect(() => {
        console.log('Participation:', currentParticipation?.playerName);
        console.log('Plays:', currentParticipation?.plays || '');
    }, [dispatch, currentParticipation]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: 2,
            position: 'absolute',
            top: '50%',
            left: isMobile ? '2%' : '5%',
            transform: 'translateY(-50%)',
            width: isMobile ? '96%' : '90%',
            paddingTop: isMobile ? '80px' : '120px',
            paddingBottom: isMobile ? '50px' : '120px',
            overflowY: 'auto',
            maxHeight: '100vh',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: isMobile ? 12 : 0,
                paddingRight: isMobile ? 2 : 0,
                paddingLeft: isMobile ? 2 : 0,
                maxWidth: isMobile ? '100%' : '20%',
                width: 'auto',
                alignItems: isMobile ? 'center' : 'flex-start',
            }}>
                <Typography gutterBottom sx={{ ...globalTheme.typography.h1, textAlign: isMobile ? 'center' : 'left' }}>Information</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    marginTop: isMobile ? 2 : 5,
                    paddingRight: isMobile ? 2 : 0,
                    paddingLeft: isMobile ? 2 : 0,
                    width: 'auto',
                    maxWidth: '100%',
                    alignItems: isMobile ? 'center' : 'flex-start',
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: isMobile ? 'center' : 'left' }}>Player: </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        padding: 1,
                        border: '1px solid #ccc',
                        width: 'auto',
                        maxWidth: '100%',
                        alignItems: isMobile ? 'center' : 'flex-start',
                    }}>
                        <Typography variant="h6" sx={{ textAlign: isMobile ? 'center' : 'left' }}>{playerName}</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: isMobile ? 'center' : 'left' }}>Game: </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        padding: 1,
                        border: '1px solid #ccc',
                        width: 'auto',
                        maxWidth: '100%',
                        alignItems: isMobile ? 'center' : 'flex-start',
                    }}>
                        <Typography variant="h6" sx={{ textAlign: isMobile ? 'center' : 'left' }}>{currentGame?.homeTeamId} vs {currentGame?.visitorTeamId}</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider orientation={isMobile ? 'vertical' : 'horizontal'} flexItem sx={{
                marginLeft: isMobile ? 0 : 2,
                marginRight: isMobile ? 0 : 2,
                borderColor: globalTheme.palette.primary.main,
                borderWidth: 2,
                marginTop: isMobile ? 4 : 0
            }} />

            <Box sx={{
                width: isMobile ? '100%' : '75%',
                height: '650px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                paddingLeft: isMobile ? 0 : 10,
                gap: 2,
                marginTop: 0,
                overflowY: 'auto',
            }}>
                <List
                    items={participation?.plays || []}
                    label1="Last Plays"
                    handleItemClick={(play) => console.log(play)}
                    height="320px"
                    renderItem={(play) =>
                        participation?.plays?.length ? (
                            <>
                                <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                    Type: {play.type}
                                </Typography>
                                <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                    Quarter: {play.quarter}
                                </Typography>
                                <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                    {play.at}
                                </Typography>
                                <Button
                                    text=""
                                    icon={<ModeEditOutlineIcon />}
                                    onClick={handleEditPlay}
                                    color="primary"
                                    backgroundColor="secondary"
                                    height="25"
                                    width="25"
                                />
                            </>
                        ) : (
                            <Box
                                sx={{
                                    height: '320px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px dashed grey',
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                <Typography>No plays available</Typography>
                            </Box>
                        )
                    }
                />
                <Typography>Quarter: {quarter}</Typography>

                <Button
                    text="+"
                    icon=""
                    onClick={handleIncreaseQuarter}
                    color="primary"
                    backgroundColor="secondary"
                    height="25"
                    width="25"
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        padding: 2,
                    }}
                >
                    <Divider sx={{ marginY: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        {playTypes.map((type) => (
                            <Button
                                text={type}
                                icon={""}
                                color="primary"
                                backgroundColor="secondary"
                                height="25"
                                width="25"
                                key={type}
                                onClick={() => handleAddPlay(type)}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TrackingPage;