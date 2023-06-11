import Cookies from 'universal-cookie';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Container, Grid, Typography, IconButton, Modal, Box, Snackbar } from '@mui/material';
import ky from 'ky';
import backendUrl from '../backendUrl';
import NewPasswordModal from '../components/NewPasswordModal';
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from '@mui/icons-material';
import ProfileModalContent from '../components/ProfileModalContent';

// страница профиля
const Profile = () => {
    // состояние пользователя
    const [user, setUser] = useState({});
    const [avatarUrl, setAvatarUrl] = useState(`${backendUrl}/users/default_avatar.png`);

    // состояние информации о пользователе
    const [userInfo, setUserInfo] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    // удаление задачи
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [taskDelete, setTaskDelete] = useState({})
    const handleDeleteOpen = (task) => {
        setTaskDelete(task);
        setOpenDeleteModal(true);
    }
    const handleDeleteClose = () => setOpenDeleteModal(false);

    // контроль snack
    const [snackDeletedMessage, setSnackDeletedMessage] = useState('');
    const [snackDeletedOpen, setSnackDeletedOpen] = useState(false);
    const showSnackMessage = (message) => { setSnackDeletedMessage(message) }
    useEffect(() => { if (snackDeletedMessage != '') setSnackDeletedOpen(true) }, [snackDeletedMessage])

    // состояние изменения пароля
    const [isCPass, setIsCPass] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // состояние избранных вопросов
    const [favorites, setFavorites] = useState([]);

    // cookies
    const cookies = new Cookies();
    const navigate = useNavigate();

    // файл аватара
    const inputFile = useRef(null)

    // обновление информации о пользователе
    const updateUser = (data) => {
        setUserInfo(data.info)
        user.info = data.info;
        cookies.set('user', user, { path: '/' });
    }

    // сохранение изменений
    const onModalSave = (newUser) => {
        ky.put(`${backendUrl}/user/${user.login}/update`, { json: user }).json().then(() => {
            setUser(newUser);
            cookies.set('user', user, { path: '/' });
        }).catch((error) => { console.log(error); alert("Ошибка редактирования пользователя") })
        setOpenModal(false)
        // window.location.reload();
    }

    // получение информации о пользователе
    useEffect(() => {
        cookies.get('user') ? setUser(cookies.get('user')) : navigate("/signin");
    }, []);

    // получение информации о пользователе
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

    // выход из аккаунта
    const logout = () => {
        cookies.remove('user');
        window.location.reload();
        navigate("/signin");
    }

    // открытие диалога 
    const openFileDialog = () => {
        inputFile.current.click();
    }

    // изменение аватара
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
        }).catch((error) => { console.log(error); })
    }

    // изменение информации о пользователе
    const handleEditInfo = () => {
        if (isEditingInfo) {
            setIsEditingInfo(false);
            user.info = userInfo;
            // mb cookies
            ky.put(`${backendUrl}/user/${user.login}/update`, { json: user }).json().then((data) => {
                console.log(data);
            }).catch((error) => { console.log(error); })
        } else {
            setIsEditingInfo(true);
        }
    }

    // удаление избранного вопроса
    const handleDeleteFavorite = () => {
        ky.delete(`${backendUrl}/favorite/${taskDelete.id}`, { json: user }).json().then((data) => {
            console.log(data)
        }).catch((error) => { console.log(error); })
        setFavorites(favorites.filter(item => item.id !== taskDelete.id))
        setOpenDeleteModal(false)
        showSnackMessage(`Удаление вопроса c id ${taskDelete.id}`)
    }

    const boxStyle = {
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    const butStyle = { width: '200px', marginTop: '7px' }

    // возвращаемый компонент
    return (
        <Container className='profile'>
            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }}>Профиль пользователя {user.name}</Typography>
            <Grid container>
                <Grid item xs={2.4}>
                    <img src={avatarUrl} alt="avatar" width="200px" height="200px" onClick={openFileDialog} /><br />
                    <Button variant='outlined' style={butStyle} onClick={handleOpen}>Редактировать</Button><br />
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
                            <>
                                <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={favorite.id}>
                                    <span style={{ color: "gray" }}>ID: {favorite.id}</span><br />
                                    <div style={{ marginTop: "-30px", textAlign: "right" }}><IconButton><Delete onClick={(e) => { handleDeleteOpen(favorite) }} /></IconButton></div>
                                    <b>Предмет: </b> {favorite.subjectName}<br />
                                    <b>Вопрос:</b><br /><span className="dl">{favorite.question}</span><br />
                                    <b>Решение:<b /></b><br /><span className="dl">{favorite.answer}</span>
                                </Paper>
                            </>
                        )
                        )}
                    </div>
                </Grid>
            </Grid>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleSelectedPicture} />
            {/* would be good to move it + button to separate component */}
            <Modal
                open={openModal}
                onClose={handleClose}
            >
                <Box sx={boxStyle}>
                    <ProfileModalContent user={user} onSave={(user) => { onModalSave(user) }} />
                </Box>
            </Modal>
            <Modal
                open={openDeleteModal}
                onClose={handleDeleteClose}
            >
                <Box sx={boxStyle}>
                    <Typography>Удалить невозвратно?</Typography>
                    <div style={{ marginTop: '10px' }}>
                        <Button variant='outlined' onClick={handleDeleteClose}>Нет</Button>
                        <Button variant='contained' style={{ marginLeft: '20px' }} onClick={() => { handleDeleteFavorite() }}>Да</Button>
                    </div>
                </Box>
            </Modal>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackDeletedOpen}
                autoHideDuration={1000}
                onClose={() => { setSnackDeletedOpen(false) }}
                message={snackDeletedMessage}
            />
        </Container>
    );
}

export default Profile;