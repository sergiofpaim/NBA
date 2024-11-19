import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import Record from './pages/Record';
import GlobalLayout from './styles/GlobalLayout';
import globalTheme from './styles/GlobalTheme';
import { ThemeProvider } from '@mui/material/styles';
import { UtilProvider } from './utils/UtilContext';


// Define breadcrumbs for each route
const breadcrumbsMap = {
  '/': [{ title: 'Home', route: '/' }],
  '/statistics': [
    { title: 'Home', route: '/' },
    { title: 'Statistics', route: '/statistics' },
  ],
  '/record': [
    { title: 'Home', route: '/' },
    { title: 'Record', route: '/record' },
  ],
};

// BreadcrumbsController component to manage routing and breadcrumb passing
const BreadcrumbsController: React.FC = () => {
  const location = useLocation();
  const breadcrumb = breadcrumbsMap[location.pathname as keyof typeof breadcrumbsMap] || breadcrumbsMap['/'];

  return (
    <UtilProvider>
      <GlobalLayout breadcrumb={breadcrumb}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/record" element={<Record />} />
        </Routes>
      </GlobalLayout>
    </UtilProvider>
  );
};

function App() {
  return (
    <ThemeProvider theme={globalTheme}>
      <Router>
        <BreadcrumbsController />
      </Router>
    </ThemeProvider>
  );
}

export default App;