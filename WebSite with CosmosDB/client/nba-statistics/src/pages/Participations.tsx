
import React, { useEffect } from 'react';
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
import { fetchParticipations } from '../stores/Transaction';
import { useNavigate, useParams } from 'react-router-dom';
import { ParticipatingPlayer } from '../models/ParticipatingPlayer';
import { setCurrentParticipation } from '../stores/Transaction';


const Participations: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();

  const { gameId } = useParams<{ gameId: string }>();

  const participations = useSelector((state: RootState) => state.transactionPlayers.participations);

  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

  useEffect(() => {
    if (gameId) {
      dispatch(fetchParticipations({ gameId }));
    }
  }, [dispatch, gameId]);


  function handleParticipationClick(participation: ParticipatingPlayer): void {
    dispatch(setCurrentParticipation(participation));
  }

  function handleCreateParticipation(): void {
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
    </Box>
  );
};

export default Participations;
