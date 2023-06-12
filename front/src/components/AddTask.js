import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/system';
import { Paper } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import backendUrl from '../backendUrl';
import ky from 'ky';

// добавление задачи
export default function AddTask(props) {
    // список задач
    const tasks = props.tasks
    const setTasks = props.setTasks

    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    // обработка нажатия кнопки
    const handleClick = (e) => {
        const task = { question, answer }
        ky.put(`${backendUrl}/local`, {json: task}).json().then((data) => {
            setQuestion("")
            setAnswer("")
            console.log(data);
            task.id = data
            const taskWrapper = {taskEntity: task, isFavorite: false, favoriteCount: 0}
            setTasks([...tasks, taskWrapper])
            props.showSnackMessage(`Вопрос добавлен под id ${data}`)
        }).catch((error) => { console.log(error); })
    }

    // элемент добавления задачи
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
