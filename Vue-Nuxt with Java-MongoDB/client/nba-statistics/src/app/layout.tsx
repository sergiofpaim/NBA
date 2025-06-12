"use client"

import React from 'react';
import { Box, Container, CssBaseline, Toolbar, AppBar, Typography, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from '../stores/Store';
import { UrlParamProvider } from '../context/UrlParamContext';
import BreadcrumbsManager from '../components/Breadcrumb';
import globalTheme from '../styles/GlobalTheme';
import '../styles/GlobalLayout.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <UrlParamProvider>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  backgroundColor: globalTheme.palette.background.default,
                  overflow: 'hidden'
                }}
              >
                <CssBaseline />
                <AppBar sx={{ backgroundColor: globalTheme.palette.background.default, padding: 0, border: 0, height: 100 }}>
                  <Toolbar sx={{ background: globalTheme.palette.background.default, display: 'flex', width: '100%' }}>
                    <Box
                      component="img"
                      src="/images/logo.png"
                      alt="Logomark"
                      sx={{ width: 'auto', height: 100, padding: '8px 20px 8px 0px' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Typography component="div" sx={{ ...globalTheme.typography.h2, fontWeight: 'bold', flexGrow: 1, color: globalTheme.palette.primary.main, paddingTop: 2 }}>
                        NBA Analytics
                      </Typography>
                      <BreadcrumbsManager />
                    </Box>
                  </Toolbar>
                </AppBar>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    flex: 1,
                    width: '100%',
                    px: isMobile ? globalTheme.spacing(0) : globalTheme.spacing(4),
                    py: isMobile ? globalTheme.spacing(20) : globalTheme.spacing(23),
                  }}
                >
                  <Container
                    component="main"
                    sx={{
                      flex: 1,
                      mt: isMobile ? globalTheme.spacing(2) : 0,
                      padding: globalTheme.spacing(2),
                      bgcolor: globalTheme.palette.background.default,
                    }}
                  >
                    {children}
                  </Container>
                </Box>
                <Box
                  component="footer"
                  sx={{
                    py: globalTheme.spacing(1),
                    textAlign: 'center',
                    bgcolor: '#f2f2f2',
                    color: globalTheme.palette.primary.main,
                    position: 'fixed',
                    bottom: 0,
                    padding: 1,
                    width: '100%',
                    borderTop: `2px solid #595959`,
                    boxShadow: globalTheme.shadows[2],
                  }}
                >
                  <Typography variant="body2" sx={{ ...globalTheme.typography.body1, color: '#595959' }}>
                    &copy; {new Date().getFullYear()} By Sérgio F. Paim
                  </Typography>
                </Box>
              </Box>
            </UrlParamProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;