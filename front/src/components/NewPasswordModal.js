import ky from "ky";
import backendUrl from "../backendUrl";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { TextField, Button, Modal, Box } from "@mui/material";

// модальное окно смены пароля
const NewPasswordModal = () => {
    // состояние полей
    var cookies = new Cookies();
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordAgain, setNewPasswordAgain] = useState();
    // проверка валидности пароля
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    // проверка валидности пароля
    function isValidPassword(password) {
        // password must contain at least 8 characters, 2 digits, 1 uppercase letter, 1 lowercase letter
        return /^(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z]).{8,}$/.test(password);
    }

    // состояние модального окна
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    // закрытие модального окна
    const handleClose = () => {
        setOpen(false);
    };

    // изменение пароля
    const changePassword = () => {
        if (newPassword !== newPasswordAgain) {
            alert("Пароли не совпадают");
            return;
        }
        var user = cookies.get('user')
        ky.put(`${backendUrl}/user/${user.login}/new-pass`, { json: { oldPassword: oldPassword, newPassword: newPassword } }).json().then((data) => {
            console.log(data);
            user.password = data;
            cookies.set('user', data, { path: '/' });
            alert("Пароль успешно изменен");
            // window.location.reload();
        }).catch((error) => {
            console.log(error);
            alert("Ошибка при изменении пароля");
        })
        handleClose()
    }

    // useEffect для проверки валидности пароля
    useEffect(() => {
        setIsPasswordValid(isValidPassword(newPassword))
    }, [newPassword])

    const boxStyle = {
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        paddingBottom: 4,
    };

    return (
        <>
            <Button variant='outlined' onClick={handleOpen}>Сменить пароль</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={boxStyle}>
                    <h2>Смена пароля</h2>
                    <form>
                        <TextField
                            style={{ marginTop: "7px" }}
                            id="outlined-basic"
                            label="Старый пароль"
                            variant="outlined"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)} /><br />
                        <TextField
                            error={!isPasswordValid}
                            style={{ marginTop: "7px" }}
                            id="outlined-basic"
                            label="Новый пароль"
                            variant="outlined"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} /><br />
                            {isPasswordValid ? null : <h4 style={{color: 'red'}}>Пароль должен содержать не менее 8 символов, 2 цифры, 1 заглавную и 1 строчную букву</h4>}
                        <TextField
                            style={{ marginTop: "7px" }}
                            id="outlined-basic"
                            label="Повторите пароль"
                            variant="outlined"
                            type="password"
                            value={newPasswordAgain}
                            onChange={(e) => setNewPasswordAgain(e.target.value)} /><br />
                        <Button
                            variant='contained'
                            style={{ width: '200px', marginTop: '7px' }}
                            onClick={() => {if (isPasswordValid) changePassword()}}>Сменить
                        </Button>
                    </form>
                </Box>
            </Modal>
        </>
    );
}

export default NewPasswordModal;