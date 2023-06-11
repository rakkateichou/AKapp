import React, { useEffect, useState } from 'react';
import ky from 'ky';
import { Button, CircularProgress, Paper, Snackbar, TextField } from '@mui/material';
import Cookies from 'universal-cookie';
import backendUrl from '../backendUrl';


const GPTSearch = () => {
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    const endPoint = 'https://api.openai.com/v1/chat/completions';
    const [isLoading, setIsLoading] = useState(false);
    const [sseData, setSseData] = useState('');
    const [textFieldValue, setTextFieldValue] = useState('');

    // cookies
    const cookies = new Cookies();
    const [user, setUser] = useState({});

    // получение информации о пользователе
    useEffect(() => {
        if (cookies.get('user')) setUser(cookies.get('user'));
    }, []);

    // контроль snack
    const [snackMessage, setSnackMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const showSnackMessage = (message) => { setSnackMessage(message) }
    useEffect(() => { if (snackMessage != '') setSnackOpen(true) }, [snackMessage])

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    };

    const handleButtonPress = () => {
        sendTextFieldData();
    };

    const sendTextFieldData = async () => {
        setIsLoading(true);
        ky.post(endPoint, {
            json: {
                model: "gpt-3.5-turbo",
                stream: true,
                messages: [
                    { "role": "system", "content": "Ты пишешь краткие решения школьных заданий. Не используй latex синтакс." },
                    { "role": "user", "content": `${textFieldValue}` }
                ]
            },
            headers: {
                'Authorization': 'Bearer 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', // ohh so secure idc
                'Content-Type': 'application/json'
            },
            timeout: 90000
        }).text().then((data) => {
            setIsLoading(false);
            parseSSEEvent(data);
        }).catch((error) => {
            setIsLoading(false);
            console.log(error);
        });
    };

    const parseSSEEvent = (eventData) => {
        const eventLines = eventData.split('\n');
        var result = "";

        for (let i = 0; i < eventLines.length; i++) {
            const line = eventLines[i];
            const colonIndex = line.indexOf(':');

            if (colonIndex > 0) {
                const field = line.substring(0, colonIndex);
                const value = line.substring(colonIndex + 1).trim();
                if (value === '[DONE]') continue;
                const parsedValue = JSON.parse(value).choices[0].delta;
                if (!parsedValue.content) continue;
                console.log(parsedValue.content);
                result += parsedValue.content;
                setSseData(result.replace(". ", ".\n"));
            }
        }
    };

    const handleFavorite = (e) => {
        const result = {}
        result.id = Math.trunc(Date.now() / 100) // damn so uniq(!)
        result.userId = user.id
        result.question = textFieldValue
        result.answer = sseData
        ky.put(`${backendUrl}/favorite`, { json: { user: user, favorite: result } }).json().then((data) => {
            console.log(data)
            showSnackMessage(`Вопрос добавлен под id ${result.id}`)
        }).catch((error) => { console.log(error); })
    }

    return (
        <div>
            <h2>Поиск вопросов при помощи искусственного интеллекта</h2>
            <Paper elevation={3} style={paperStyle}>
                <div>
                    <img src="https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" alt="openai" style={{ width: '5%', width: '55px', height: '55px' }} />
                    <TextField id="outlined-basic" label="Ваш запрос" variant="outlined" style={{ width: '75%', marginLeft: '10px' }} value={textFieldValue} onChange={(e) => setTextFieldValue(e.target.value)} multiline />
                    <Button variant='contained' style={{ width: '15%', height: '55px', marginTop: '-45px', marginLeft: '10px' }} onClick={handleButtonPress}>Спросить</Button>
                </div>
            </Paper>
            {isLoading ? (
                <CircularProgress style={{ marginTop: '20px' }} />
            ) : null}
            {sseData !== '' ? (
                <Paper elevation={3} style={paperStyle}>
                    <h4 style={{ marginTop: '-20px' }}>Ответ:</h4>
                    {sseData}
                    <div style={{ marginTop: '25px' }}><Button variant='contained' onClick={handleFavorite}>Добавить в избранное</Button></div>
                </Paper>
            ) : null}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen}
                autoHideDuration={1000}
                onClose={() => { setSnackOpen(false) }}
                message={snackMessage}
            />
        </div>
    );
};

export default GPTSearch;
