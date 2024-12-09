
import React, { useEffect } from 'react';
import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import Button from '../components/Button';
import { fetchGames, fetchPlayerParticipation, fetchTeams, setCurrentGame, setCurrentParticipation } from '../stores/Transaction';
import { useParams } from 'react-router-dom';
import { fetchSeasons } from '../stores/Selection';
import List from '../components/ItemsList';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';
import { Participation } from '../models/Participation';

const TrackingPage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();

    const { gameId } = useParams<{ gameId: string }>();
    const { playerId } = useParams<{ playerId: string }>();

    const seasons = useSelector((state: RootState) => state.seasons.seasons);
    const games = useSelector((state: RootState) => state.transactionGames.games);
    const teams = useSelector((state: RootState) => state.transactionTeams.teams);
    const currentParticipation = useSelector((state: RootState) => state.transactionPlayers.currentParticipation);
    const participatingPlayer = useSelector((state: RootState) => state.transactionParticipation.participation);
    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);

    const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

    useEffect(() => {
        dispatch(fetchSeasons());
        dispatch(fetchGames());
    }, [dispatch, gameId]);

    useEffect(() => {
        if (gameId && playerId) {
            dispatch(fetchPlayerParticipation({ gameId, playerId }))
        }
    }, [dispatch, gameId, playerId])


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
        if (currentGame && teams.length > 0) {
            const homeTeam = teams.find(team => team.teamId === currentGame.homeTeamId);
            const visitorTeam = teams.find(team => team.teamId === currentGame.visitorTeamId);
            if (homeTeam && visitorTeam) {
                const playersOfTheCurrentGame = [
                    ...(homeTeam.players || []),
                    ...(visitorTeam.players || []),
                ];
                dispatch(setCurrentParticipation(playersOfTheCurrentGame.find(p => p.playerId === playerId)));
            }
        }
    }, [dispatch, teams, currentGame, playerId]);

    useEffect(() => {
        console.log('Participation:', participatingPlayer?.playerName);  // Log the participation object
        console.log('Plays:', participatingPlayer?.plays || '');    // Log the plays array
    }, [dispatch, participatingPlayer]);

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
                        <Typography variant="h6" sx={{ textAlign: isMobile ? 'center' : 'left' }}>{currentParticipation?.playerName}</Typography>
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
                paddingLeft: isMobile ? 0 : 4,
                gap: 2,
                marginTop: 0,
                overflowY: 'auto',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                </Box>
                <List
                    items={participatingPlayer?.plays || []}
                    label1="Plays"
                    handleItemClick={(play) => console.log(play)}
                    renderItem={(play) => (
                        <>
                            Quarter: {play.quarter} Type: {play.type} Points: {play.points ?? 'N/A'} At: {new Date(play.at).toLocaleString()}
                        </>
                    )}
                />
            </Box>
        </Box>
    );
};

export default TrackingPage;