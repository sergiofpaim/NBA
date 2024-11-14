import React, { ReactNode } from 'react';
import { Box, Container, CssBaseline, Toolbar, AppBar, Typography, useMediaQuery, Breadcrumbs, Link } from '@mui/material';
import { useTheme, Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  route: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

const GlobalLayout: React.FC<LayoutProps> = ({ children, breadcrumb }) => {
  const globalTheme: Theme = useTheme();
  const isMobile = useMediaQuery(globalTheme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: globalTheme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: globalTheme.palette.secondary.main, padding: 0, border: 0 }}>
        <Toolbar sx={{ background: globalTheme.palette.background.default, display: 'flex', width: '100%' }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="Logomark"
            sx={{ width: 'auto', height: 100, padding: '8px 20px 8px 0px' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography variant="h1" component="div" sx={{ ...globalTheme.typography.h1, flexGrow: 1, color: globalTheme.palette.primary.main, paddingTop: 2 }}>
              NBA Analytics
            </Typography>
            {breadcrumb && (
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: globalTheme.palette.primary.main, font: globalTheme.typography.fontFamily }} separator="›">
                {breadcrumb.map((item, index) => (
                  <Link
                    key={index}
                    color="inherit"
                    onClick={() => navigate(item.route)}
                    sx={{ cursor: 'pointer', fontWeight: "bold", color: globalTheme.palette.primary.main }}
                  >
                    {item.title}
                  </Link>
                ))}
              </Breadcrumbs>
            )}
          </Box>
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
  );
};

export default GlobalLayout;