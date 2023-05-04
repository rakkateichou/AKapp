import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const [user, setUser] = useState({});
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        cookies.get('user') ? setUser(cookies.get('user')) : navigate("/signin");
    }, []);

    const logout = () => {
        cookies.remove('user');
        window.location.reload();
        navigate("/signin");
    }

    return ( 
        <>
            <h1>Профиль</h1>
            <h2>Привет, {user.name}</h2>
            <button onClick={logout}>Выйти</button>
            <br/><br/>
            <a href="/">На главную</a>
        </>
     );
}
 
export default Profile;