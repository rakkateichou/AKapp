import { Paper } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import backendUrl from "../backendUrl";

const TaskSearch = () => {
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
        // получение результатов поиска
        fetch(`${backendUrl}/local?query=` + query)
            .then((resp) => resp.json())
            .then((res) => setResults(res))
    }, [query])
    // элемент поиска
    return (
        <>
            <h2>Поиск задач по вопросу</h2>
            <Paper elevation={3} style={paperStyle}>
                <TextField id="outlined-basic" label="Ваш запрос" variant="outlined" fullWidth value={query} onChange={(e) => setQuery(e.target.value)} />
            {results.length > 0 &&
                <>
                    <h2>Результаты поиска</h2>
                    {results.map(result => (
                    <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={result.id}>
                        <span style={{ color: "gray" }}>ID: {result.id}</span><br />
                        <b>Вопрос:</b><br />{result.question}<br />
                        <b>Ответ:<b /></b><br />{result.answer}
                    </Paper>
                    ))}
                </>
            }
            </Paper>
        </>
    );
}

export default TaskSearch;