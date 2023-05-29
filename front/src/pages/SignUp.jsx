import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { Container, TextField, Button } from "@mui/material";
import backendUrl from "../backendUrl";

const SignUp = () => {
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [badRegistration, setBadRegistration] = useState(false);
    
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const cookies = new Cookies();
    const navigate = useNavigate();

    function isValidEmail(email) { // better to also make checks on backend 
        if (email === "") return true;
        return /\S+@\S+\.\S+/.test(email);
    }

    function isValidPassword(password) {
        if (password === "") return true;
        // password must contain at least 8 characters, 2 digits, 1 uppercase letter, 1 lowercase letter
        return /^(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z]).{8,}$/.test(password);
    }

    const handleSubmit = (e) => {
        if (password !== passwordAgain) {
            alert("Пароли не совпадают");
            return;
        }
        if (!isEmailValid || !isPasswordValid || (email === "") || (password === "")) {
            alert("Проверьте правильность введенных данных");
            return;
        }
        e.preventDefault();
        const user = { name: name, login: login, email: email, password: password };
        console.log(user);
        ky.put(`${backendUrl}/user`, { json: user }).json().then((data) => {
            console.log(data);
            setBadRegistration(false);
            cookies.set('user', data, { path: '/' });
            navigate("/profile")
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            setBadRegistration(true);
        })
    }

    useEffect(() => {
        setIsEmailValid(isValidEmail(email))
    }, [email])

    useEffect(() => {
        setIsPasswordValid(isValidPassword(password))
    }, [password])

    return (
        <>
            <h2>Регистрация</h2>
            <Container maxWidth="xs">
                <form onSubmit={handleSubmit} >
                    <TextField
                        style={{ marginTop: "7px", width: "70%" }}
                        label="Имя"
                        variant="outlined"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    /><br/>
                    <TextField
                        style={{ marginTop: "7px", width: "70%" }}
                        label="Логин"
                        variant="outlined"
                        value={login}
                        onChange={(e) => { setLogin(e.target.value) }}
                    /><br/> 
                    <TextField
                        error={!isEmailValid}
                        style={{ marginTop: "7px", width: "70%" }}
                        label="E-mail"
                        variant="outlined"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    /><br/>
                    {isEmailValid ? null : <h4 style={{color: 'red'}}>Некорректный email</h4>}
                    <TextField
                        error={!isPasswordValid}
                        style={{ marginTop: "7px", width: "70%" }}
                        label="Пароль"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    /><br/>
                    {isPasswordValid ? null : <h4 style={{color: 'red'}}>Пароль должен содержать не менее 8 символов, 2 цифры, 1 заглавную и 1 строчную букву</h4>}
                    <TextField
                        style={{ marginTop: "7px", width: "70%" }}
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