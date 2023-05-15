import ky from "ky";
import { useRef } from "react";
import { useState } from "react";
import Cookies from 'universal-cookie';
import { redirect, useNavigate } from "react-router-dom";
import { Container, TextField, Button } from "@mui/material";

const SignIn = () => {
    const [status, setStatus] = useState(false);
    const [badLogin, setBadLogin] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        redirect("/")
        event.preventDefault();
        setStatus(true);
        ky.post("http://localhost:8080/user", { json: { login: login, password: password } }).json().then((data) => {
            console.log(data);
            cookies.set('user', data, { path: '/' });
            setBadLogin(false);
            navigate("/profile");
            window.location.reload();
        }).catch((error) => {
            setStatus(false);
            setBadLogin(true);
        })
        // cookies.set('user', user, { path: '/' });
        // redirect("/profile")
    }

    return (
        <>
            <h2>Авторизация</h2>
            <Container maxWidth="xs">
                <form onSubmit={handleSubmit} >
                    <TextField
                        style={{marginTop: "7px"}}
                        label="Логин"
                        variant="outlined"
                        value={login}
                        onChange={(e) => {setLogin(e.target.value)}}
                    />
                    <TextField
                        style={{marginTop: "7px"}}
                        label="Пароль"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                    />
                    <br/>
                    <Button
                        style={{marginTop: "7px"}}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Войти
                    </Button>
                </form>
                <br/>
                <a href="/signup">Ещё не зарегистрированы?</a>
            </Container>
            {status && <h5>Происходит авторизация</h5>}
            {badLogin && <h5>Неверный логин или пароль</h5>}
        </>
    );
}

export default SignIn;