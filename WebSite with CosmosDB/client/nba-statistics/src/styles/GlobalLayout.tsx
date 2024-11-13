import React, { ReactNode } from 'react';
import { Box, Container, CssBaseline, Toolbar, AppBar, Typography, useMediaQuery } from '@mui/material';
import { useTheme, Theme, withTheme } from '@mui/material/styles';

interface LayoutProps {
  children: ReactNode;
  breadcrumb?: ReactNode; // Optional breadcrumb prop
}

const GlobalLayout: React.FC<LayoutProps> = ({ children, breadcrumb }) => {
  const globalTheme: Theme = useTheme(); // Access the globalTheme theme
  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm')); // Use globalTheme's breakpoints

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: globalTheme.palette.background.default, // Apply globalTheme background color
        overflow: 'hidden', // Prevent the main content from overflowing
      }}
    >
      <CssBaseline />

      {/* AppBar for header */}
      <AppBar position="static" sx={{ backgroundColor: globalTheme.palette.secondary.main, padding: 0, border: 0}}> 
       <Toolbar sx={{ background: globalTheme.palette.background.default, display: 'flex', width: '100%'}}>
        <Box
          component="img"
          src="/images/logo.png" // Image from the public folder
          alt="Logomark"
          sx={{ width: 'auto', height: 100,  padding: '8px 20px 8px 0px' }} // Adjust the style as needed
          />
          {/* Applying globalTheme typography style directly */}
          <Typography variant="h1" component="div" sx={{ ...globalTheme.typography.h1, flexGrow: 1, color: globalTheme.palette.primary.main }}>
            NBA Analytics
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flex: 1,
          width: '100%',
          px: isMobile ? globalTheme.spacing(2) : globalTheme.spacing(4),
          py: globalTheme.spacing(2),
        }}
      >
        {/* Main content area */}
        <Container
          component="main"
          sx={{
            flex: 1,
            mt: isMobile ? globalTheme.spacing(2) : 0,
            padding: globalTheme.spacing(2),
            bgcolor: globalTheme.palette.background.default,
          }}
        >
          {/* Render the breadcrumb here if provided */}
          {breadcrumb && (
            <Box sx={{ mb: 2 }}>
              {breadcrumb}
            </Box>
          )}

          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: globalTheme.spacing(1),
          textAlign: 'center',
          bgcolor: globalTheme.palette.grey[500],
          color: globalTheme.palette.primary.main,
          position: 'fixed',
          bottom: 0,
          padding: 1,
          width: '100%',
          borderTop: `2px solid ${globalTheme.palette.grey[600]}`,
          boxShadow: globalTheme.shadows[2],
        }}
      >
        <Typography variant="body2" sx={{ ...globalTheme.typography.body1, color: globalTheme.palette.grey[50] }}>
          &copy; {new Date().getFullYear()} By Sérgio F. Paim
        </Typography>
      </Box>
    </Box>
  );
};

export default GlobalLayout;
