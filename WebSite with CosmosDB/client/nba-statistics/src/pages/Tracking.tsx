
import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import Button from '../components/Button';
import { fetchParticipations, fetchTeams, setCurrentGame, setCurrentParticipation } from '../stores/Transaction';
import { useParams } from 'react-router-dom';
import List from '../components/ItemsList';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { fetchGames } from '../stores/Transaction';
import { fetchSeasons } from '../stores/Selection';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';

const TrackingPage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();

    const { gameId } = useParams<{ gameId: string }>();
    const { playerId } = useParams<{ playerId: string }>();

    const seasons = useSelector((state: RootState) => state.seasons.seasons);
    const games = useSelector((state: RootState) => state.transactionGames.games);
    const teams = useSelector((state: RootState) => state.transactionTeams.teams);
    const participations = useSelector((state: RootState) => state.transactionPlayers.participations);

    const currentParticipation = useSelector((state: RootState) => state.transactionPlayers.currentParticipation);
    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);

    const [playerName, setPlayerName] = useState<string>('');

    const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

    useEffect(() => {
        dispatch(fetchSeasons());
        dispatch(fetchGames());
    }, [dispatch, gameId]);

    useEffect(() => {
        if (games && gameId) {
            dispatch(setCurrentGame(games.find(game => game.id === gameId)));
        }
    }, [dispatch, games, gameId]);

    useEffect(() => {
        dispatch(fetchParticipations({ gameId: gameId ?? "" }));
    }, [dispatch, gameId]);

    useEffect(() => {
        if (participations)
            dispatch(setCurrentParticipation(participations.find(p => p.playerId === playerId)));
    }, [dispatch, participations, playerId]);

    useEffect(() => {

        dispatch(setCurrentParticipation(participations.find(p => p.playerId === playerId)));
    }, [dispatch, currentParticipation, participations, playerId]);

    useEffect(() => {
        if (seasons.length > 0) {
            dispatch(fetchTeams({ seasonId: seasons[seasons.length - 1].id }));
        }
    }, [dispatch, seasons]);

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



    const formatPlayTime = (timeString: any) => {
        const [hours, minutes, seconds] = timeString.split(':');
        const [secs, milliseconds] = seconds.split('.');

        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        time.setSeconds(parseInt(secs, 10));
        time.setMilliseconds(parseInt(milliseconds.slice(0, 3), 10));

        return time.toLocaleString();
    };

    useEffect(() => {
        console.log('Participation:', currentParticipation?.playerName);
        console.log('Plays:', currentParticipation?.plays || '');
    }, [dispatch, currentParticipation]);

    function handlePlay(): void {
        throw new Error('Function not implemented.');
    }

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
                    items={currentParticipation?.plays || []}
                    label1="Last Plays"
                    handleItemClick={(play) => console.log(play)}
                    height="320px"
                    renderItem={(play) =>
                        currentParticipation?.plays?.length ? (
                            <>
                                <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                    Type: {play.type}
                                </Typography>
                                <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                    Quarter: {play.quarter}
                                </Typography>
                                <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                    {formatPlayTime(play.at)}
                                </Typography>
                                <Button
                                    text=""
                                    icon={<ModeEditOutlineIcon />}
                                    onClick={handlePlay}
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
            </Box>
        </Box>
    );
};

export default TrackingPage;