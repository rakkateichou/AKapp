import ky from "ky";
import backendUrl from "../backendUrl";
import Cookies from "universal-cookie";
import { useState } from "react";
import { TextField, Button } from "@mui/material";

const NewPasswordForm = () => {

    var cookies = new Cookies();
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordAgain, setNewPasswordAgain] = useState();

    const changePassword = () => {
        if (newPassword !== newPasswordAgain) {
            alert("Пароли не совпадают");
            return;
        }
        var user = cookies.get('user')
        ky.put(`${backendUrl}/user/${user.login}/new-pass`, { json: { oldPassword: oldPassword, newPassword: newPassword } }).json().then((data) => {
            console.log(data);
            user.password = data;
            alert("Пароль успешно изменен");
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            alert("Ошибка при изменении пароля");
        })
    }
    return (
        <form>
            <TextField
                style={{ marginTop: "7px" }}
                id="outlined-basic"
                label="Старый пароль"
                variant="outlined"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}/><br />
            <TextField
                style={{ marginTop: "7px" }}
                id="outlined-basic"
                label="Новый пароль"
                variant="outlined"
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}/><br />
            <TextField
                style={{ marginTop: "7px" }}
                id="outlined-basic"
                label="Повторите пароль"
                variant="outlined"
                type="password" 
                value={newPasswordAgain}
                onChange={(e) => setNewPasswordAgain(e.target.value)}/><br/>
            <Button
                variant='contained'
                style={{ width: '200px', marginTop: '7px' }}
                onClick={changePassword}>Сменить
            </Button>
        </form>
    );
}

export default NewPasswordForm;