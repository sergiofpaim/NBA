
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Divider, Typography, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, TableCell } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import globalTheme from '../styles/GlobalTheme';
import { AppDispatch, RootState } from '../stores/Store';
import List from '../components/TableComponent';
import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';
import { setCurrentPlayerOfGame } from '../stores/Transaction';
import { PlayerSelection } from '../models/PlayerSelection';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TableComponent from '../components/TableComponent';

const Participations: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { gameId } = useParams<{ gameId: string }>();

  const teams = useSelector((state: RootState) => state.transactionTeams.teams);
  const currentGame = useSelector((state: RootState) => state.transactionGames.currentGame);
  const participations = useSelector((state: RootState) => state.transactionPlayers.players);

  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

  const [openDialog, setOpenDialog] = useState(false);

  const [currentPlayer, setCurrentPlayer] = useState<PlayerSelection | ParticipatingPlayer | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSelection | ParticipatingPlayer | null>(null);
  const [playersNotInCurrentGame, setPlayersNotInCurrentGame] = useState<PlayerSelection[]>([]);


  function handleParticipationClick(participation: ParticipatingPlayer): void {
    setCurrentPlayer(participation);
  }

  function handleCreateParticipation(): void {
    setOpenDialog(true);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  function handleParticipationSelect(event: SelectChangeEvent): void {
    const selectedPlayerId = event.target.value;
    const selectedPlayer = playersNotInCurrentGame.find(player => player.playerId === selectedPlayerId);
    setSelectedPlayer(selectedPlayer || null);
  }

  function handleSubmit(): void {
    if (selectedPlayer) {
      setCurrentPlayer(selectedPlayer);
    }
  }

  useEffect(() => {
    if (currentGame && teams.length > 0) {
      const homeTeam = teams.find(team => team.teamId === currentGame.homeTeamId);
      const visitorTeam = teams.find(team => team.teamId === currentGame.visitorTeamId);
      if (homeTeam && visitorTeam) {
        const playersOfTheCurrentGame = [
          ...(homeTeam.players || []),
          ...(visitorTeam.players || []),
        ];

        const filteredPlayers = playersOfTheCurrentGame.filter(player => {
          return !participations.some(participation => participation.playerId === player.playerId);
        });

        setPlayersNotInCurrentGame(filteredPlayers);
      }
    }
  }, [currentGame, teams, participations]);

  const GoToTrackingPage = useCallback(() => {
    if (currentPlayer) {
      navigate(`/record/${gameId}/participations/${currentPlayer?.playerId}/tracking`);
    }
  }, [currentPlayer, gameId, navigate]);

  useEffect(() => {
    if (currentPlayer) {
      dispatch(setCurrentPlayerOfGame(currentPlayer));
      GoToTrackingPage();
    }
  }, [GoToTrackingPage, currentPlayer, dispatch]);

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
        marginTop: isMobile ? 0 : 0
      }} />

      <Box sx={{
        width: isMobile ? '100%' : '75%',
        height: 'calc(100vh - 250px)',
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
          <Button icon={<AddCircleOutlineIcon />} text="Create" minWidth='100px' height='45' textSize='15px' onClick={handleCreateParticipation} />
        </Box>
        <TableComponent
          items={participations}
          handleItemClick={(participation: ParticipatingPlayer) => handleParticipationClick(participation)}
          renderItem={(participation: ParticipatingPlayer) => [
            <TableCell key="playerName" sx={{
              borderBottomWidth: "10px",
              borderBottomColor: globalTheme.palette.background.default,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center"
            }}>
              <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2, textAlign: "center" }}>
                {participation.playerName}
              </Typography>
            </TableCell>,
            <TableCell key="teamId" sx={{
              borderBottomWidth: "10px",
              borderBottomColor: globalTheme.palette.background.default,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}>
              <Typography sx={{ fontSize: isMobile ? '14px' : '20px', padding: isMobile ? 1 : 2, textAlign: "center" }}>
                {participation.teamId}
              </Typography>
            </TableCell>,
          ]}
          label="Participations"
        />
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
            <Select
              labelId="home-team-label"
              value={selectedPlayer?.playerId || ''}
              onChange={handleParticipationSelect}
              label="Home Team"
              sx={{
                color: globalTheme.palette.primary.main,
                borderColor: globalTheme.palette.secondary.main,
                height: '56px'
              }}
            >
              {playersNotInCurrentGame.map((player) => (
                <MenuItem key={player.playerId} value={player.playerId}>{player.playerName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
          <Button text="Cancel" textSize='15px' onClick={handleDialogClose} color={globalTheme.palette.secondary.main} backgroundColor={globalTheme.palette.primary.main} minWidth='25' height='40' icon='' />
          <Button
            text="Create"
            textSize='15px'
            onClick={handleSubmit}
            disabled={!selectedPlayer}
            color={globalTheme.palette.primary.main} backgroundColor={globalTheme.palette.secondary.main} minWidth='25' height='40' icon=''
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Participations;