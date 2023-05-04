import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/system';
import { Paper } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';

export default function AddTask() {
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleClick = (e) => {
        const task = { question, answer }
        fetch("http://localhost:8080/task", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        }).then(() => {
            console.log("Новая задача добавлена!")
        }).then(() => {
            window.location.reload();
        })
    }

    return (
        <>
            <h2>Добавить задачу</h2>
            <Paper elevation={3} style={paperStyle}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 },
                    }}
                    //   , width: '25ch'
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="Вопрос задачи" variant="outlined" fullWidth value={question} onChange={(e) => setQuestion(e.target.value)} />
                    <TextField id="outlined-basic" label="Ответ задачи" variant="outlined" fullWidth value={answer} onChange={(e) => setAnswer(e.target.value)} />
                </Box>
                <Button variant="contained" onClick={handleClick}>Сохранить</Button>
            </Paper>
        </>
    );
}
