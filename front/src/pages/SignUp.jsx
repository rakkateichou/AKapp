import ky from "ky";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { Container, TextField, Button } from "@mui/material";

const SignUp = () => {
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [badRegistration, setBadRegistration] = useState(false);
    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        if (password !== passwordAgain) {
            alert("Пароли не совпадают");
            return;
        }
        e.preventDefault();
        const user = { name: name, login: login, password: password };
        console.log(user);
        ky.put("http://localhost:8080/user", { json: user }).json().then((data) => {
            console.log(data);
            setBadRegistration(false);
            cookies.set('user', user, { path: '/' });
            navigate("/profile")
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            setBadRegistration(true);
        })
    }

    return (
        <>
            <h2>Регистрация</h2>
            <Container maxWidth="xs">
                <form onSubmit={handleSubmit} >
                    <TextField
                        style={{ marginTop: "7px" }}
                        label="Имя"
                        variant="outlined"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <TextField
                        style={{ marginTop: "7px" }}
                        label="Логин"
                        variant="outlined"
                        value={login}
                        onChange={(e) => { setLogin(e.target.value) }}
                    />
                    <TextField
                        style={{ marginTop: "7px" }}
                        label="Пароль"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <TextField
                        style={{ marginTop: "7px" }}
                        label="Повторите пароль"
                        variant="outlined"
                        type="password"
                        value={passwordAgain}
                        onChange={(e) => { setPasswordAgain(e.target.value) }}
                    />
                    <br />
                    <Button
                        style={{ marginTop: "7px" }}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Зарегистрироваться
                    </Button>
                </form>
                <br />
                <a href="/signin">Уже есть аккаунт?</a>
            </Container>
            <br />
            {badRegistration && <h5>Такой пользователь уже существует</h5>}
        </>
    );
}

export default SignUp;