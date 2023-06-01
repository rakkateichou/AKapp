import { Paper } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import backendUrl from "../backendUrl";
import TaskPaper from "./TaskPaper";
import ky from "ky";

const TaskSearch = (props) => {
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    // состояние строки поиска
    const [query, setQuery] = useState('');
    // результаты поиска
    const [results, setResults] = useState([]);
    useEffect(() => {
        if (query === '') {
            setResults([])
            return
        }
        if (props.user.id === undefined) props.user.id = -1;
        // получение результатов поиска
        fetch(`${backendUrl}/local?query=` + query + "&userId=" + props.user.id)
            .then((resp) => resp.json())
            .then((res) => setResults(res))
    }, [query])

    // удаление задачи
    const handleDeleteTask = (e, task) => {
        ky.delete(`${backendUrl}/local/${task.id}`).json().then((data) => {
            console.log(data);
        }).catch((error) => { console.log(error); })
        setResults(results.filter(item => item.taskEntity.id !== task.id))
    }


    // элемент поиска
    return (
        <>
            <h2>Поиск задач по вопросу</h2>
            <Paper elevation={3} style={paperStyle}>
                <TextField id="outlined-basic" label="Ваш запрос" variant="outlined" fullWidth value={query} onChange={(e) => setQuery(e.target.value)} />
                {results.length > 0 &&
                    <>
                        <h2>Результаты поиска</h2>
                        {/* результаты поиска */}
                        {results.map(result => (
                            <TaskPaper key={result.taskEntity.id} response={result} hasRating={props.user.login !== undefined} deletable onDelete={(e) => { handleDeleteTask(e, result.taskEntity) }} handleStarTask={(e) => { if (!result.isFavorite) props.handleStarTask(e, result.taskEntity) }} />
                        ))}
                    </>
                }
            </Paper>
        </>
    );
}

export default TaskSearch;