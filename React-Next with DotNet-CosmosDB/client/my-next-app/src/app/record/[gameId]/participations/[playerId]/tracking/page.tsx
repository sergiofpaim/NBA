"use client"

import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Divider, TableCell, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../../../../../../styles/GlobalTheme';
import { AppDispatch, RootState } from '../../../../../../stores/Store';
import Button from '../../../../../../components/Button';
import { addPlay, deletePlay, loadPlayers, setParticipation } from '../../../../../../stores/Transaction';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/Error';
import ReplayIcon from '@mui/icons-material/Replay';
import { GamePlay } from '../../../../../../models/GamePlay';
import TableComponent from '../../../../../../components/TableComponent';

type TrackingPageProps = {
    params: Promise<{
        playerId: string;
        gameId: string;
    }>;
};

const TrackingPage: React.FC<TrackingPageProps> = ({ params }) => {
    const dispatch: AppDispatch = useDispatch();

    const [gameId, setGameId] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const resolvedParams = await Promise.resolve(params);
            setGameId(resolvedParams.gameId);
            setPlayerId(resolvedParams.playerId);
        })();
    }, [params]);

    const teams = useSelector((state: RootState) => state.transactionTeams.teams);
    const participation = useSelector((state: RootState) => state.transactionParticipation.participation);

    const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);

    const [playerName, setPlayerName] = useState<string>('');
    const [quarter, setQuarter] = useState(1);
    const [currentPlay, setCurrentPlay] = useState<GamePlay | null>(null);

    const [openChangeQuarterDialog, setOpenChangeQuarterDialog] = useState(false);
    const [openDeletePlayDialog, setOpenDeletePlayDialog] = useState(false);

    const handleDialogClose = () => {
        setOpenChangeQuarterDialog(false);
        setOpenDeletePlayDialog(false);
    };

    const handleDeletePlayDialog = (play: GamePlay) => {
        setCurrentPlay(play);
        setOpenDeletePlayDialog(true);
    }

    const handleDeletePlay = () => {
        if (participation && currentPlay)
            dispatch(deletePlay({ participationId: participation?.participationId, at: currentPlay.at }));
        setOpenDeletePlayDialog(false);
    }

    const handleIncreaseQuarter = () => {
        setQuarter(prevQuarter => prevQuarter + 1);
        setOpenChangeQuarterDialog(false);
    };

    const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

    const handleAddPlay = (type: string) => {
        if (gameId && playerId) {
            const payload = { gameId, playerId, quarter: quarter, type };
            dispatch(addPlay(payload));
        }

        setTimeout(() => {
            if (gameId) {
                dispatch(loadPlayers({ gameId }));
            }
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
        Turnover: <ErrorIcon color="primary" />,
        Block: <BlockIcon color="primary" />,
        Foul: <ErrorIcon sx={{ color: globalTheme.palette.secondary.main }} />,
        Rebound: <ReplayIcon sx={{ color: "#ffc34d" }} />,
    };

    const getPlayText = (type: string) =>
        type.includes('FreeThrow') ? '1' :
            type.includes('TwoPointer') ? '2' :
                type.includes('ThreePointer') ? '3' :
                    type.includes('Rebound') ? 'R' :
                        type.includes('Assist') ? 'A' :
                            type.includes('Block') ? 'B' :
                                type.includes('Turnover') ? 'T' :
                                    type.includes('Foul') ? 'F' :
                                        type;

    const getPlayTextColor = (type: string) =>
        type.includes('Hit') ? 'green' :
            ['Miss', 'Foul'].some(keyword => type.includes(keyword))
                ? globalTheme.palette.secondary.main :
                ['Rebound'].some(keyword => type.includes(keyword))
                    ? "#ffc34d"
                    : type;

    useEffect(() => {
        dispatch(setParticipation(null))
    }, [dispatch]);

    useEffect(() => {
        if (participation?.plays && participation.plays.length > 0) {
            const highestQuarter = Math.max(...participation.plays.map(play => play.quarter));
            setQuarter(highestQuarter);
        }
    }, [participation]);

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
            maxHeight: '100vh',
            overflowY: 'auto'
        }}>
            {!isMobile && (
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
            )}
            {!isMobile && (

                <Divider orientation={isMobile ? 'vertical' : 'horizontal'} flexItem sx={{
                    marginLeft: isMobile ? 0 : 2,
                    marginRight: isMobile ? 0 : 2,
                    borderColor: globalTheme.palette.primary.main,
                    borderWidth: 2,
                    marginTop: isMobile ? 4 : 0
                }} />
            )}
            <Box sx={{
                width: isMobile ? '100%' : '75%',
                height: isMobile ? 'calc(100vh - 20px)' : 'calc(100vh - 240px)',
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: isMobile ? 0 : 10,
                paddingTop: isMobile ? 10 : 0,
                gap: 2
            }}>
                <TableComponent
                    items={participation?.plays || []}
                    label="Last Plays"
                    handleItemClick={(play) => console.log(play)}
                    height={isMobile ? 'auto' : 'calc(100vh - 100px)'}
                    itemHeight={isMobile ? '30px' : '50px'}
                    isItemDisabled={() => false}
                    renderItem={(play) => [
                        <Box
                            key="Play-Type"
                            sx={{
                                height: '40px',
                                borderBottomWidth: "10px",
                                borderBottomColor: globalTheme.palette.background.default,
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                '&:hover': {
                                    borderBottomColor: globalTheme.palette.background.default
                                }
                            }}
                        >
                            <Tooltip
                                title={(() => {
                                    if (play.type.includes('FreeThrowMiss')) return 'Free-Throw Miss';
                                    if (play.type.includes('TwoPointerMiss')) return 'Two-Pointer Miss';
                                    if (play.type.includes('ThreePointerMiss')) return 'Three-Pointer Miss';
                                    if (play.type.includes('FreeThrowHit')) return 'Free-Throw Hit';
                                    if (play.type.includes('TwoPointerHit')) return 'Two-Pointer Hit';
                                    if (play.type.includes('ThreePointerHit')) return 'Three-Pointer Hit';
                                    if (play.type.includes('Assist')) return 'Assist';
                                    if (play.type.includes('Rebound')) return 'Rebound';
                                    if (play.type.includes('Turnover')) return 'Turnover';
                                    if (play.type.includes('Block')) return 'Block';
                                    if (play.type.includes('Foul')) return 'Foul';
                                    return 'Unknown Play';
                                })()}
                                arrow
                            >
                                <span>{playTypeIcons[play.type] || <ErrorIcon color="disabled" />}</span>
                            </Tooltip>
                            <Typography
                                sx={{
                                    fontSize: isMobile ? '14px' : '20px',
                                    padding: 1,
                                    color: getPlayTextColor(play.type)
                                }}
                            >
                                {getPlayText(play.type)}
                            </Typography>
                        </Box>,
                        <Box
                            key="Play-Quarter"
                            sx={{
                                borderBottomWidth: "10px",
                                borderBottomColor: globalTheme.palette.background.default,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: '40px'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: isMobile ? '14px' : '20px',
                                    padding: isMobile ? 1 : 2,
                                }}
                            >
                                Q{play.quarter}
                            </Typography>
                        </Box>,
                        <Box
                            key="Play-At"
                            sx={{
                                borderBottomWidth: "10px",
                                borderBottomColor: globalTheme.palette.background.default,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: '40px'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: isMobile ? '14px' : '20px',
                                    padding: isMobile ? 1 : 2,
                                }}
                            >
                                {play.at.split('.')[0]}
                            </Typography>
                        </Box>,
                        <Box
                            key="Play-Quarter"
                            sx={{
                                marginTop: 0,
                                borderBottomWidth: "10px",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                borderBottomColor: globalTheme.palette.background.default,
                                height: '40px'
                            }}
                        >
                            <Button
                                icon={<DeleteIcon style={{ fontSize: '20px' }} />}
                                onClick={() => handleDeletePlayDialog(play)}
                                backgroundColor={globalTheme.palette.secondary.main}
                                sx={{
                                    minWidth: 0.2,
                                    marginTop: 0
                                }}
                                height={isMobile ? '20px' : '35px'}
                            />
                        </Box>
                    ]}
                />
                <Box sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    padding: { xs: 1, sm: 2, md: 1 }
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: { xs: 3, sm: 4, md: 1 },
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: { xs: 0, sm: 0 },
                            }}
                        >
                            <Typography sx={{
                                fontSize: {
                                    xs: '0.8rem',
                                    sm: '1rem',
                                    md: '1.1rem',
                                    lg: '1.2rem',
                                },
                            }}>Register</Typography>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: { xs: 1, sm: 0 },
                                flexDirection: { xs: 'row', sm: 'row' },
                                gap: 1,
                            }}
                        >
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Quarter: {quarter}</Typography>
                            <Button
                                icon={<AddCircleOutlineIcon />}
                                onClick={() => setOpenChangeQuarterDialog(true)}
                                backgroundColor={globalTheme.palette.secondary.main}
                                height="30px"
                                minWidth="30px"
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 1,
                                gridTemplateColumns: {
                                    xs: 'repeat(6, 1fr)',
                                    sm: 'repeat(4, 1fr)',
                                    md: 'repeat(6, 1fr)'
                                },
                            }}
                        >
                            {playTypes.map((type, index) => (
                                <Button
                                    text={getPlayText(type)}
                                    icon={playTypeIcons[type]}
                                    color={getPlayTextColor(type)}
                                    backgroundColor={globalTheme.palette.background.default}
                                    sx={{
                                        height: {
                                            xs: '20px',
                                            sm: '40px',
                                            md: '40px'
                                        },
                                        minWidth: {
                                            xs: '30px',
                                            sm: '40px',
                                            md: '40px'
                                        },
                                    }}
                                    key={type}
                                    onClick={() => handleAddPlay(type)}
                                    hoverColor={globalTheme.palette.primary.main}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Dialog open={openChangeQuarterDialog} onClose={handleDialogClose} sx={{
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
                        <Button text="Cancel" textSize="15px" onClick={handleDialogClose} color={globalTheme.palette.secondary.main} backgroundColor={globalTheme.palette.primary.main} height="25" minWidth="40" icon="" />
                        <Button text="Change" textSize="15px" onClick={handleIncreaseQuarter} color={globalTheme.palette.primary.main} backgroundColor={globalTheme.palette.secondary.main} height="25" minWidth="40" icon="" />
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={openDeletePlayDialog} onClose={handleDialogClose} sx={{
                '& .MuiDialog-paper': {
                    width: '500px', maxWidth: '500px', height: 'auto', maxHeight: '90vh', borderRadius: 2, boxShadow: 3,
                    display: 'flex', flexDirection: 'column', backgroundColor: globalTheme.palette.background.default
                }
            }}>
                <DialogTitle sx={{
                    color: globalTheme.palette.primary.main, marginBottom: 0, fontWeight: 600, fontSize: '1.25rem', textAlign: 'center'
                }}>
                    DELETE PLAY
                </DialogTitle>
                <DialogContent sx={{ paddingTop: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        Are you sure you want to delete this play? This action is irreversible.
                    </ Typography>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
                        <Button text="Cancel" textSize="15px" onClick={handleDialogClose} color={globalTheme.palette.secondary.main} backgroundColor={globalTheme.palette.primary.main} height="25" minWidth="40" icon="" />
                        <Button text="Delete" textSize="15px" onClick={() => handleDeletePlay()} color={globalTheme.palette.primary.main} backgroundColor={globalTheme.palette.secondary.main} height="25" minWidth="40" icon="" />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box >
    );
};

export default TrackingPage;