import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';

// заголовок страницы
export default function Appbar(props) {
  const cn = props.cn
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookies = new Cookies();
  useEffect(() => {
    if (cookies.get('user')) {
      setIsLoggedIn(true);
      setUser(cookies.get('user'));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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

          <div className='logo'>
            <Typography variant="h4" component="span" color='#000000'>
              <Link to="/">
                <span className='font-logo'><b>SOTVETIS</b></span>
              </Link>
            </Typography>
          </div>

          <div className='links'>
            <Link to="/db"><span className='linkTool'>Локальная база данных</span></Link> 
          </div>
          
          <div className='links'>
            <Link to="/net"><span className='linkTool'>Интернет источники</span></Link>
          </div>

          {!isLoggedIn && 
            <div className='linkProfile'>
              <Link to='/signin'><span className='linkTool'>Вход в аккаунт</span></Link>
            </div>
          }
          {isLoggedIn &&
            <div className='linkProfile'>
              <Link to='/profile'><span className='linkTool'>Профиль {user.name}</span></Link>
            </div>
          }
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
