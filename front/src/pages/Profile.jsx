import Cookies from 'universal-cookie';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Container, Grid, Typography, IconButton } from '@mui/material';
import ky from 'ky';
import backendUrl from '../backendUrl';
import NewPasswordForm from '../components/NewPasswordForm';
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from '@mui/icons-material';


const Profile = () => {
    const [user, setUser] = useState({});
    const [avatarUrl, setAvatarUrl] = useState(`${backendUrl}/users/default_avatar.png`);

    // mb name and email later
    const [userInfo, setUserInfo] = useState("");

    const [isCPass, setIsCPass] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    
    const [favorites, setFavorites] = useState([]);

    const cookies = new Cookies();
    const navigate = useNavigate();

    const inputFile = useRef(null)

    const updateUser = (data) => {
        setUserInfo(data.info)
        user.info = data.info;
        cookies.set('user', user, { path: '/' });
    }

    useEffect(() => {
        cookies.get('user') ? setUser(cookies.get('user')) : navigate("/signin");
    }, []);

    useEffect(() => {
        if (user.login === undefined) { return }
        setUserInfo(user.info)
        ky.post(`${backendUrl}/user/${user.login}/data`, { body: user.password }).json().then((data) => {
            console.log(data);
            updateUser(data);
        }).catch((error) => { console.log(error); })
        ky.get(`${backendUrl}/users/${user.login}/avatar.png`).then((response) => {
            setAvatarUrl(`${backendUrl}/users/${user.login}/avatar.png`)
        }).catch((error) => { console.log(error); })
        ky.post(`${backendUrl}/favorites`, { json: user }).json().then((data) => {
            console.log(data);
            setFavorites(data);
        }).catch((error) => { console.log(error); })
    }, [user]);

    const logout = () => {
        cookies.remove('user');
        window.location.reload();
        navigate("/signin");
    }

    const openFileDialog = () => {
        inputFile.current.click();
    }

    const handleSelectedPicture = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) { return }
        const formData = new FormData();
        formData.append("file", file);
        ky.put(`${backendUrl}/user/${user.login}/avatar`, { body: formData }).json().then((data) => {
            console.log(data);
            if (data !== "null") {
                alert("Аватар успешно изменен");
                setAvatarUrl(`${backendUrl}/users/${user.login}/avatar.png`)
                window.location.reload();
            } else {
                alert("Ошибка при изменении аватара");
            }
        }).catch((error) => {console.log(error);})
    }

    const handleEditInfo = () => {
        if (isEditingInfo) {
            setIsEditingInfo(false);
            user.info = userInfo;
            // mb cookies
            ky.put(`${backendUrl}/user/${user.login}/update`, { json: user }).json().then((data) => {
                console.log(data);
            }).catch((error) => {console.log(error);})
        } else {
            setIsEditingInfo(true);
        }
    }

    const handleDeleteFavorite = (e, favorite) => {
        ky.delete(`${backendUrl}/favorite/${favorite.id}`, {json: user}).json().then((data) => {
            console.log(data)
        }).catch((error) => {console.log(error);})
        setFavorites(favorites.filter(item => item.id !== favorite.id))
    }

    const butStyle = { width: '200px', marginTop: '7px' }

    return (
        <Container className='profile'>
            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }}>Профиль пользователя {user.name}</Typography>
            <Grid container>
                <Grid item xs={2.4}>
                    <img src={avatarUrl} alt="avatar" width="200px" height="200px" onClick={openFileDialog} /><br />
                    <Button variant='outlined' style={butStyle} onClick={() => setIsCPass(!isCPass)}>Сменить пароль</Button><br />
                    {isCPass && <NewPasswordForm />}
                    <Button variant='contained' style={butStyle} onClick={logout}>Выйти</Button>
                </Grid>
                <Grid item xs={9.6}>
                    <Paper elevation={3} className='paper' style={{ padding: '10px', minHeight: '180px' }}>
                        <Grid container>
                            <Grid item xs={6} style={{ marginTop: '10px' }}>
                                <b>Информация о пользователе:</b>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'right' }}>
                                <IconButton onClick={() => { handleEditInfo() }}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <div style={{ marginTop: '5px' }}>
                            {isEditingInfo ? (
                                <div>
                                    <TextField
                                        label='Введите информацию о себе' variant='outlined'
                                        multiline
                                        value={userInfo}
                                        onChange={(e) => { setUserInfo(e.target.value) }}
                                        style={{ width: '100%', marginBottom: '10px' }} />
                                </div>
                            ) : (
                                <div style={{ textAlign: 'justify' }}>
                                    {userInfo}
                                </div>
                            )}
                        </div>
                    </Paper>
                    <div style={{ textAlign: 'center' }}>
                        <h4>Избранные вопросы</h4>
                        {favorites.map((favorite) => (
                                <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={favorite.id}>
                                <span style={{ color: "gray" }}>ID: {favorite.id}</span><br />
                                <div style={{ marginTop: "-30px",textAlign: "right" }}><IconButton><Delete onClick={(e) => {handleDeleteFavorite(e, favorite)}} /></IconButton></div>
                                <b>Предмет: </b> {favorite.subjectName}<br />
                                <b>Вопрос:</b><br /><span className="dl">{favorite.question}</span><br />
                                <b>Решение:<b /></b><br /><span className="dl">{favorite.answer}</span>
                            </Paper>
                            )
                        )}
                    </div>
                </Grid>
            </Grid>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleSelectedPicture} />
        </Container>
    );
}

export default Profile;