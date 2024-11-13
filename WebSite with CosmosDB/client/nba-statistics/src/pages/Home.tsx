import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box } from '@mui/material';

const HomePage = () => {

  const navigate = useNavigate();

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/statistics')}
          style={{ marginBottom: '20px' }}
        >
          Go to Statistics
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/record')}
        >
          Go to Record
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
