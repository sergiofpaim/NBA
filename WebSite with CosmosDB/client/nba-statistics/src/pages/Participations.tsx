
import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button as MuiButton, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import List from '../components/ItemsList';
import { Game } from '../models/Game';
import Button from '../components/Button';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { fetchGames, fetchParticipations, fetchTeams, setCurrentGame } from '../stores/Transaction';
import { useNavigate, useParams } from 'react-router-dom';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';
import { setCurrentParticipation } from '../stores/Transaction';
import { fetchSeasons } from '../stores/Selection';
import { PlayerSelection } from '../models/PlayerSelection';


const Participations: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();

  const { gameId } = useParams<{ gameId: string }>();

  const seasons = useSelector((state: RootState) => state.seasons.seasons);
  const teams = useSelector((state: RootState) => state.transactionTeams.teams);
  const games = useSelector((state: RootState) => state.transactionGames.games);
  const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);
  const participations = useSelector((state: RootState) => state.transactionPlayers.participations);

  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);

  const [playersNotInCurrentGame, setPlayersNotInCurrentGame] = useState<PlayerSelection[]>([]);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchSeasons());
      dispatch(fetchTeams({ seasonId: seasons[seasons.length - 1].id }));
      dispatch(fetchGames());
      dispatch(setCurrentGame(games.find(game => game.id === gameId)));
      dispatch(fetchParticipations({ gameId }));
    }
  }, [dispatch, gameId, games, seasons]);


  function handleParticipationClick(participation: ParticipatingPlayer): void {
    dispatch(setCurrentParticipation(participation));
  }

  function handleCreateParticipation(): void {
    if (currentGame) {
      const homeTeam = teams.find(team => team.teamId === currentGame.homeTeamId);
      const visitorTeam = teams.find(team => team.teamId === currentGame.visitorTeamId);

      const playersOfTheCurrentGame = [
        ...(homeTeam?.players || []),
        ...(visitorTeam?.players || [])
      ];

      const filteredPlayers = playersOfTheCurrentGame.filter(player => {
        return !participations.some(participation => participation.id === player.playerId);
      });

      setPlayersNotInCurrentGame(filteredPlayers);
    }

    setOpenDialog(true);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  function handleSubmit(): void {
    throw new Error('Function not implemented.');
  }

  function handleTeamSelect(e: SelectChangeEvent<ParticipatingPlayer[]>, arg1: string): void {
    throw new Error('Function not implemented.');
  }

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
        <Typography gutterBottom sx={{ ...globalTheme.typography.h1 }}>Details</Typography>
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
          <Button text="Create Participation" height='200px' width='45' textSize='15px' onClick={handleCreateParticipation} />
        </Box>
        <List items={participations} handleItemClick={(participation: ParticipatingPlayer) => handleParticipationClick(participation)} renderItem={(participations: ParticipatingPlayer) => (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                {participations.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2 }}>
                {participations.teamId}
              </Typography>
            </Box>
          </>
        )} label1="Participations" />
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
          NEW PARTICIPATION
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel id="home-team-label" sx={{ color: globalTheme.palette.primary.main }}>
              Player Name
            </InputLabel>
            <Select labelId="home-team-label" value={participations} onChange={(e) => handleTeamSelect(e, 'home')} label="Home Team" sx={{
              color: globalTheme.palette.primary.main, borderColor: globalTheme.palette.secondary.main, height: '56px'
            }}>
              {playersNotInCurrentGame.map((player) => (
                <MenuItem key={player.playerId} value={player.playerName}>{player.playerName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
          <Button text="Cancel" onClick={handleDialogClose} color="secondary" backgroundColor="primary" height='25' width='40' icon='' />
          <Button
            text="Create"
            onClick={handleSubmit}
            color="primary" backgroundColor="secondary" height='25' width='40' icon=''
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Participations;
