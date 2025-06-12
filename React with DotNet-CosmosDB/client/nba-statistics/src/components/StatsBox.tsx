import React from 'react';
import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import globalTheme from '../styles/GlobalTheme';

interface StatBoxProps {
  label: string;
  value: string | number;
  boxWidth?: string | number;
  position?: string;
  sx?: SxProps<Theme>;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, boxWidth, position, sx }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        fontSize: 20,
        padding: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        width: boxWidth || 'auto',
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: 20,
          color: globalTheme.palette.grey[400],
        }}
      >
        {label}:
      </Typography>
      <Typography
        sx={{
          fontSize: 20,
          color: globalTheme.palette.primary.main,
          fontWeight: 'bold',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default StatBox;