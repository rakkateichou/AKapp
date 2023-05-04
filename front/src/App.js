import './App.css';
import Appbar from './components/Appbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Local from './pages/Local';
import Net from './pages/Net';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

// главная функция
function App() {
  return (
    <div className="App"
      style={{
        backgroundImage: `url("/back.webp")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        minHeight: '100vh'
      }}>
      <BrowserRouter>
        <Appbar />
        <Routes>
          <Route path='/' element={ <Main />} />
          <Route path='/db' element={ <Local /> } />
          <Route path='/net' element={ <Net /> }/>
          <Route path='/signin' element={ <SignIn /> }/>
          <Route path='/signup' element={ <SignUp /> }/>
          <Route path='/profile' element={ <Profile /> }/>
          <Route path='*' element={ <h1>404</h1> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;