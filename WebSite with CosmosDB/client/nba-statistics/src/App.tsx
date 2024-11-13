import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import Record from './pages/Record';
import Layout from './styles/GlobalLayout';  // Import the Layout component
import globalTheme from './styles/global-theme';  // Import your globalTheme
import { ThemeProvider } from '@mui/material/styles';


function App() {
  return (
    <ThemeProvider theme={globalTheme}>
      <Layout>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/record" element={<Record />} />
          </Routes>
        </Router>
       </Layout>
    </ThemeProvider>
  );
}

export default App;
