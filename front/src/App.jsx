import './App.css';
import Appbar from './components/Appbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Local from './pages/Local';
import Net from './pages/Net';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Restore from './pages/Restore';
import GPTSearch from './pages/GPTSearch';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch, CssBaseline } from '@mui/material';
import { useTheme } from '@emotion/react';

// главная функция
function App() {

  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const appTheme = createTheme({
    palette: {
      mode: mode,
    },
  });
  
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <div className="App"
        style={{
          backgroundImage: appTheme.palette.mode === 'light' ? `url("/back.webp")` : 'none',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          minHeight: '100vh'
        }}>
        {/* BrowserRouter для определения страниц*/}
        <BrowserRouter>
          <Appbar cn="toolbar" appStyle={{ 
            backgroundColor: appTheme.palette.mode === 'light' ? "#C0C0C0" : "#1C1C1C" 
          }} toggleTheme={toggleTheme}/>
          <Routes>
            <Route path='/' element={<Main toggleTheme={toggleTheme}/>} />
            <Route path='/db' element={<Local />} />
            <Route path='/net' element={<Net />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/restore' element={<Restore />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/gpt' element={<GPTSearch />} />
            <Route path='*' element={<h1>404</h1>} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
