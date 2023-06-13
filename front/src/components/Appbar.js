import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { DarkMode, LightMode } from '@mui/icons-material';

// заголовок страницы
export default function Appbar(props) {
  // состояние строки
  const cn = props.cn
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookies = new Cookies();

  const theme = useTheme()

  // useEffect для проверки авторизации
  useEffect(() => {
    if (cookies.get('user')) {
      setIsLoggedIn(true);
      setUser(cookies.get('user'));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // элемент строки
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={props.appStyle} elevation={props.elevation}>
        <Toolbar className={cn}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <div className='leftContent'>
            <div className='logo'>
              <Typography variant="h4" component="span" color='#000000'>
                <Link to="/" id={theme.palette.mode}>
                  <span className='font-logo'><b>SOTVETIS</b></span>
                </Link>
              </Typography>
            </div>

            <div className='links'>
              <Link to="/db" id={theme.palette.mode}><span className='linkTool'>Локальная база данных</span></Link>
            </div>

            <div className='links'>
              <Link to="/net" id={theme.palette.mode}><span className='linkTool'>Интернет источники</span></Link>
            </div>

            <div className='links'>
              <Link to="/gpt" id={theme.palette.mode}><span className='linkTool'>Искусственный интеллект</span></Link>
            </div>
          </div>

          {!isLoggedIn &&
            <div className='linkProfile'>
              <Link to='/signin' id={theme.palette.mode}><span className='linkTool'>Вход в аккаунт</span></Link>
            </div>
          }
          {isLoggedIn &&
          <>
            <div className='linkProfile'>
              <Link to='/profile' id={theme.palette.mode}><span className='linkTool'>Профиль {user.name}</span></Link>
            </div>
            {theme.palette.mode === 'light' ? <LightMode onClick={props.toggleTheme} style={{color: cn === 'toolbar' ? '#000' : 'none'}}/> : <DarkMode onClick={props.toggleTheme}/>}
          </>
          }
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
