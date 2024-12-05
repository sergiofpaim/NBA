import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button as MuiButton, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import { createGame, fetchGames, fetchTeams, setCurrentGame } from '../stores/Transaction';
import List from '../components/ItemsList';
import { Game } from '../models/Game';
import Button from '../components/Button';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { fetchSeasons } from '../stores/Selection';
import { useNavigate } from 'react-router-dom';

const Record: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const seasons = useSelector((state: RootState) => state.seasons.seasons);
  const games = useSelector((state: RootState) => state.transactionGames.games);
  const teams = useSelector((state: RootState) => state.transactionTeams.teams);

  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

  const [openDialog, setOpenDialog] = useState(false);

  type GameDetails = {
    homeTeamId: string | null;
    visitorTeamId: string | null;
    at: Date | null;
  };

  const [gameDetails, setGameDetails] = useState<GameDetails>({
    homeTeamId: null,
    visitorTeamId: null,
    at: null,
  });

  const [gameDate, setGameDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    dispatch(fetchSeasons());
    dispatch(fetchGames());
  }, [dispatch]);

  const handleCreateGame = (): void => {
    setOpenDialog(true);
    dispatch(fetchTeams({ seasonId: seasons[seasons.length - 1].id }));
  };

  const handleGameClick = (game: Game) => {
    dispatch(setCurrentGame(game));
    navigate(`/record/participations/${game.id}`);
  };


  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTeamSelect = (event: SelectChangeEvent<unknown>, teamType: 'home' | 'visitor') => {
    const { value } = event.target;
    setGameDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [`${teamType}TeamId`]: value as string,
      };
      if (teamType === 'home' && updatedDetails.visitorTeamId === value)
        updatedDetails.visitorTeamId = '';
      else if (teamType === 'visitor' && updatedDetails.homeTeamId === value)
        updatedDetails.homeTeamId = '';

      return updatedDetails;
    });
  };

  const handleDateSelect = (newDate: Dayjs | null) => {
    if (newDate) {
      setGameDate(newDate);
      setGameDetails((prevDetails) => ({
        ...prevDetails,
        at: newDate.toDate(),
      }));
    }
  };

  const handleSubmit = () => {
    if (gameDetails.homeTeamId && gameDetails.visitorTeamId && gameDetails.at) {
      dispatch(createGame({
        homeTeamId: gameDetails.homeTeamId,
        visitorTeamId: gameDetails.visitorTeamId,
        at: gameDetails.at,
      }));
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'flex-start',
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
        width: isMobile ? '100%' : '20%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginTop: isMobile ? 12 : 0,
        paddingRight: isMobile ? 2 : 0,
        paddingLeft: isMobile ? 2 : 0
      }}>
        <Typography gutterBottom sx={{ ...globalTheme.typography.h1 }}>Last Games</Typography>
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
          <Button text="Create Game" height='200px' width='45' onClick={handleCreateGame} />
        </Box>
        <List items={games} handleItemClick={(game: Game) => handleGameClick(game)} renderItem={(game: Game) => (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                {game.homeTeamId} vs {game.visitorTeamId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                {new Date(game.at).toLocaleString()}
              </Typography>
            </Box>
          </>
        )} label1="Home vs Visitor" label2="At" />
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
          NEW GAME
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel id="home-team-label" sx={{ color: globalTheme.palette.primary.main }}>
              Home Team
            </InputLabel>
            <Select labelId="home-team-label" value={gameDetails.homeTeamId} onChange={(e) => handleTeamSelect(e, 'home')} label="Home Team" sx={{
              color: globalTheme.palette.primary.main, borderColor: globalTheme.palette.secondary.main, height: '56px'
            }}>
              {teams.map((team) => (
                <MenuItem key={team.teamId} value={team.teamId}>{team.teamName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel id="visitor-team-label" sx={{ color: globalTheme.palette.primary.main }}>
              Visitor Team
            </InputLabel>
            <Select labelId="visitor-team-label" value={gameDetails.visitorTeamId} onChange={(e) => handleTeamSelect(e, 'visitor')} label="Visitor Team" sx={{
              color: globalTheme.palette.primary.main, borderColor: globalTheme.palette.secondary.main, height: '56px'
            }}>
              {teams.map((team) => (
                <MenuItem key={team.teamId} value={team.teamId}>{team.teamName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Game Date" value={gameDate} onChange={(newDate) => handleDateSelect(newDate)} slotProps={{
              textField: {
                fullWidth: true, sx: {
                  marginTop: 3, borderColor: globalTheme.palette.secondary.main, height: '56px', color: globalTheme.palette.primary.main
                }, InputLabelProps: { sx: { color: 'white' } }
              },
              yearButton: { sx: { color: globalTheme.palette.background.default } },
              calendarHeader: { sx: { color: globalTheme.palette.background.default } },
              day: {
                sx: {
                  color: globalTheme.palette.background.default, '&:hover': { backgroundColor: globalTheme.palette.primary.dark }
                }
              },
              openPickerIcon: { sx: { color: 'white' } }
            }} />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
          <Button text="Cancel" onClick={handleDialogClose} color="secondary" backgroundColor="primary" height='25' width='40' icon='' />
          <Button
            text="Create"
            onClick={handleSubmit}
            disabled={!gameDetails.homeTeamId || !gameDetails.visitorTeamId || !gameDetails.at}
            color="primary" backgroundColor="secondary" height='25' width='40' icon=''
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Record;