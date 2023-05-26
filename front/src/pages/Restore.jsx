import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container } from "@mui/material";
import backendUrl from "../backendUrl";
import ky from "ky";

const Restore = () => {
    // const delay = ms => new Promise(res => setTimeout(res, ms));

    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [code, setCode] = useState("")

    const [codeSent, setCodeSent] = useState(false);

    const [newPass, setNewPass] = useState("");

    const handleSendCode = (e) => {
        e.preventDefault();
        ky.post(`${backendUrl}/user/restore/code`, { body: login }).json()
        setCodeSent(true);
    }

    const handleSubmitNewPass = (e) => {
        e.preventDefault();
        ky.post(`${backendUrl}/user/restore`, { json: { login: login, code: code, password: newPass } }).json().then((data) => {
            alert("Пароль успешно изменен\nВы будете перенаправлены на страницу авторизации");
            // await delay(5000);
            navigate("/signin");
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <Container style={{ maxWidth: "500px" }}>
            <h3>Восстановление пароля</h3>
            <form>
                {!codeSent &&
                    <>
                        <TextField
                            style={{ marginTop: "7px" }}
                            label="Логин"
                            variant="outlined"
                            value={login}
                            onChange={(e) => { setLogin(e.target.value) }}
                        /><br />
                        <Button
                            style={{ marginTop: "7px" }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={(e) => { handleSendCode(e) }}
                        >
                            Отправить код подтверждения
                        </Button><br />
                    </>}
                {codeSent &&
                    <>
                        <p>Код подтверждения отправлен на почту</p>
                        <TextField
                            style={{ marginTop: "7px" }}
                            label="Код подтверждения"
                            variant="outlined"
                            value={code}
                            onChange={(e) => { setCode(e.target.value) }}
                        /><br />
                        <TextField
                            style={{ marginTop: "7px" }}
                            label="Новый пароль"
                            variant="outlined"
                            type="password"
                            value={newPass}
                            onChange={(e) => { setNewPass(e.target.value) }}
                        /><br />
                        <Button
                            style={{ marginTop: "7px" }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={(e) => { handleSubmitNewPass(e) }}
                        >
                            Сохранить новый пароль
                        </Button><br />
                    </>
                }
            </form>
        </Container>
    );
}

export default Restore;