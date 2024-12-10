
import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Divider, FormControl, InputLabel, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import Button from '../components/Button';
import { addPlay, deletePlay, fetchParticipation, fetchPlayers, fetchTeams, setCurrentGame, setCurrentPlayerOfGame, setParticipation } from '../stores/Transaction';
import { useParams } from 'react-router-dom';
import List from '../components/ItemsList';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { fetchGames } from '../stores/Transaction';
import { fetchSeasons } from '../stores/Selection';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/Error';
import ReplayIcon from '@mui/icons-material/Replay';


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

    const [openDialog, setOpenDialog] = useState(false);

    function handleChangeQuarter(): void {
        setOpenDialog(true);
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
    };


    const handleDeletePlay = (at: Date) => {
        if (participation && at)
            dispatch(deletePlay({ participationId: participation?.participationId, at: at }));
    }

    const handleIncreaseQuarter = () => {
        setQuarter(prevQuarter => prevQuarter + 1);
        setOpenDialog(false);
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

    const playTypeIcons: { [key: string]: React.ReactNode } = {
        FreeThrowHit: <SportsBasketballIcon sx={{ color: 'green' }} />,
        TwoPointerHit: <SportsBasketballIcon sx={{ color: 'green' }} />,
        ThreePointerHit: <SportsBasketballIcon sx={{ color: 'green' }} />,
        FreeThrowMiss: <SportsBasketballIcon sx={{ color: globalTheme.palette.secondary.main }} />,
        TwoPointerMiss: <SportsBasketballIcon sx={{ color: globalTheme.palette.secondary.main }} />,
        ThreePointerMiss: <SportsBasketballIcon sx={{ color: globalTheme.palette.secondary.main }} />,
        Assist: <AddCircleIcon color="primary" />,
        Rebound: <ReplayIcon color="primary" />,
        Turnover: <ErrorIcon color="primary" />,
        Block: <BlockIcon color="primary" />,
        Foul: <ErrorIcon sx={{ color: globalTheme.palette.secondary.main }} />,
    };

    const getButtonColor = (type: string) =>
        ['Miss', 'Hit', 'Foul'].some(keyword => type.includes(keyword))
            ? globalTheme.palette.background.default
            : '#ffc34d';

    const getPlayText = (type: string) =>
        type.includes('FreeThrow') ? '1' :
            type.includes('TwoPointer') ? '2' :
                type.includes('ThreePointer') ? '3' :
                    type;

    const getPlayTextColor = (type: string) =>
        type.includes('Hit') ? 'green' :
            ['Miss', 'Foul'].some(keyword => type.includes(keyword))
                ? globalTheme.palette.secondary.main
                : type;


    useEffect(() => {
        dispatch(fetchSeasons());
        dispatch(fetchGames());
        dispatch(setParticipation(null))
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
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                width: '100%',
                alignItems: 'center',
                paddingLeft: isMobile ? 0 : 30
            }}>
                <Box sx={{
                    width: isMobile ? '100%' : '75%',
                    height: '650px',
                    display: 'flex',
                    flexDirection: 'column',
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
                        itemSize="4px"
                        renderItem={(play) =>
                            participation?.plays ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Tooltip
                                            title={(() => {
                                                if (play.type.includes('FreeThrowMiss')) {
                                                    return 'Free-Throw Miss';
                                                } else if (play.type.includes('TwoPointerMiss')) {
                                                    return 'Two-Pointer Miss';
                                                } else if (play.type.includes('ThreePointerMiss')) {
                                                    return 'Three-Pointer Miss';
                                                } else if (play.type.includes('FreeThrowHit')) {
                                                    return 'Free-Throw Hit';
                                                } else if (play.type.includes('TwoPointerHit')) {
                                                    return 'Two-Pointer Hit';
                                                } else if (play.type.includes('ThreePointerHit')) {
                                                    return 'Three-Pointer Hit';
                                                } else if (play.type.includes('Assist')) {
                                                    return 'Assist';
                                                } else if (play.type.includes('Rebound')) {
                                                    return 'Rebound';
                                                } else if (play.type.includes('Turnover')) {
                                                    return 'Turnover';
                                                } else if (play.type.includes('Block')) {
                                                    return 'Block';
                                                } else if (play.type.includes('Foul')) {
                                                    return 'Foul';
                                                } else {
                                                    return 'Unknown Play';
                                                }
                                            })()}
                                            arrow
                                        >
                                            <span>{playTypeIcons[play.type] || <ErrorIcon color="disabled" />}</span>
                                        </Tooltip>
                                        <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                            {(() => {
                                                if (play.type.includes('Free')) {
                                                    return '1';
                                                } else if (play.type.includes('Two')) {
                                                    return '2';
                                                } else if (play.type.includes('Three')) {
                                                    return '3';
                                                } else if (play.type.includes('Assist')) {
                                                    return 'A';
                                                } else if (play.type.includes('Rebound')) {
                                                    return 'R';
                                                } else if (play.type.includes('Turnover')) {
                                                    return 'T';
                                                } else if (play.type.includes('Block')) {
                                                    return 'B';
                                                } else if (play.type.includes('Foul')) {
                                                    return 'F';
                                                } else {
                                                    return '';
                                                }
                                            })()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                            Q{play.quarter}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                                            {play.at.split('.')[0]}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Button
                                            icon={<DeleteIcon />}
                                            onClick={() => handleDeletePlay(play.at)}
                                            backgroundColor={globalTheme.palette.secondary.main}
                                            height="25"
                                            width="25"
                                        />
                                    </Box>
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
                                    <Typography sx={{ color: globalTheme.palette.primary.main }}>No plays available</Typography>
                                </Box>
                            )
                        }
                    />
                    <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: { xs: 1, sm: 0 },
                                }}
                            >
                                <Typography sx={{ fontSize: { xs: '24px', sm: '30px' }, fontWeight: 'bold' }}>Register</Typography>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: { xs: 1, sm: 0 },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 1,
                                }}
                            >
                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                    Quarter: {quarter}
                                </Typography>
                                <Button
                                    icon={<AddCircleOutlineIcon />}
                                    onClick={handleChangeQuarter}
                                    backgroundColor={globalTheme.palette.secondary.main}
                                    height="40px"
                                    width="40px"
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* First row of buttons */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                                {playTypes.slice(0, 6).map((type) => (
                                    <Button
                                        text={getPlayText(type)}
                                        icon={playTypeIcons[type]}
                                        color={getPlayTextColor(type)}
                                        backgroundColor={getButtonColor(type)}
                                        height="25"
                                        width="25"
                                        key={type}
                                        onClick={() => handleAddPlay(type)}
                                        hoverColor={globalTheme.palette.primary.main}
                                    />
                                ))}
                            </Box>

                            {/* Second row of buttons */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                                {playTypes.slice(6, 10).map((type) => (
                                    <Button
                                        text={getPlayText(type)}
                                        icon={playTypeIcons[type]}
                                        color={getPlayTextColor(type)}
                                        backgroundColor={getButtonColor(type)}
                                        height="25"
                                        width="25"
                                        key={type}
                                        onClick={() => handleAddPlay(type)}
                                    />
                                ))}
                            </Box>

                            {/* Third row of buttons */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                                {playTypes.slice(10).map((type) => (
                                    <Button
                                        text={getPlayText(type)}
                                        icon={playTypeIcons[type]}
                                        color={getPlayTextColor(type)}
                                        backgroundColor={getButtonColor(type)}
                                        height="25"
                                        width="25"
                                        key={type}
                                        onClick={() => handleAddPlay(type)}
                                        hoverColor={globalTheme.palette.primary.main}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </Box>
            <Dialog open={openDialog} onClose={handleDialogClose} sx={{
                '& .MuiDialog-paper': {
                    width: '500px', maxWidth: '500px', height: 'auto', maxHeight: '90vh', borderRadius: 2, boxShadow: 3,
                    display: 'flex', flexDirection: 'column', backgroundColor: globalTheme.palette.background.default
                }
            }}>
                <DialogTitle sx={{
                    color: globalTheme.palette.primary.main, marginBottom: 0, fontWeight: 600, fontSize: '1.25rem', textAlign: 'center'
                }}>
                    CHANGE QUARTER
                </DialogTitle>
                <DialogContent sx={{ paddingTop: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        Are you sure you want to change the quarter? This action is irreversible.
                    </ Typography>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
                        <Button text="Cancel" textSize="15px" onClick={handleDialogClose} color={globalTheme.palette.secondary.main} backgroundColor={globalTheme.palette.primary.main} height="25" width="40" icon="" />
                        <Button text="Change" textSize="15px" onClick={handleIncreaseQuarter} color={globalTheme.palette.primary.main} backgroundColor={globalTheme.palette.secondary.main} height="25" width="40" icon="" />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box >
    );
};

export default TrackingPage;