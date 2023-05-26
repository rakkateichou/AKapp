import { useState, useEffect } from "react";
import { Button, Grid, IconButton, Paper, TextField } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import ky from "ky";
import backendUrl from "../backendUrl";
import { Star, StarBorder } from "@mui/icons-material";
import Cookies from "universal-cookie";

const Net = () => {
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    // состояние строки поиска
    const [query, setQuery] = useState('');
    // результаты поиска
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [searching, setSearching] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [searchingAllSubjects, setSearchingAllSubjects] = useState(true);
    const [subject, setSubject] = useState("");

    const [updateHack, setUpdateHack] = useState(false); // i am tired really

    const cookies = new Cookies();
    const [user, setUser] = useState({});

    useEffect(() => {
        if (cookies.get('user')) setUser(cookies.get('user'));
    }, []);

    const search = () => {
        var qt = query
        setPage(1)
        setSearching(true)
        setNotFound(false)
        // получение результатов поиска
        ky.get(`${backendUrl}/int`, { searchParams: { query: qt, page: page, subjects: subject }, timeout: 900000, retry: 3 }).json()
            .then((data) => {
                if (data.length === 0) setNotFound(true)
                console.log(data);
                setResults(data);
                setSearching(false);
            })
    }
    const searchNextPage = () => {
        setPage(page + 1)
        ky.get(`${backendUrl}/int`, { searchParams: { query: query, page: page, subjects: subject }, timeout: 900000, retry: 3 }).json()
            .then((data) => {
                console.log(data)
                setResults(results.concat(data))
            })
    }
    const handleChange = (e) => {
        if (e.target.value === "") {
            setSearchingAllSubjects(true);
        } else {
            setSearchingAllSubjects(false);
        }
        setResults([])
        setSubject(e.target.value)
    }

    const handleStarTask = (e, result) => {
        result.userId = user.id
        result.starred = "yes"
        setUpdateHack(!updateHack)
        ky.put(`${backendUrl}/favorite`, { json: { user: user, favorite: result } }).json().then((data) => {
            console.log(data)
        }).catch((error) => { console.log(error); })
    }

    // элемент поиска
    return (
        <>
            {updateHack && null}
            <h2>Поиск задач по вопросу</h2>
            <Paper elevation={3} style={paperStyle}>
                <div>
                    <TextField id="outlined-basic" label="Ваш запрос" variant="outlined" style={{ width: '80%' }} value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Button variant='contained' style={{ width: '15%', marginTop: '8px', marginLeft: '10px' }} onClick={search}>Поиск</Button>
                </div>
                <select style={{ width: '40%', marginTop: "5px" }} value={subject} onChange={handleChange}>
                    <option value="">Все предметы</option>
                    <option value="Математика базового уровня">Математика базового уровня</option>
                    <option value="Математика профильного уровня">Математика профильного уровня</option>
                    <option value="Информатика">Информатика</option>
                    <option value="Русский язык">Русский язык</option>
                    <option value="Английский язык">Английский язык</option>
                    <option value="Физика">Физика</option>
                    <option value="Химия">Химия</option>
                    <option value="Биология">Биология</option>
                    <option value="География">География</option>
                    <option value="Обществознание">Обществознание</option>
                    <option value="Литература">Литература</option>
                    <option value="История">История</option>
                    <option value="Немецкий язык">Немецкий язык</option>
                    <option value="Французский язык">Французский язык</option>
                </select>
                {searchingAllSubjects &&
                    <>
                        <span style={{ fontSize: "12px" }}>
                            <b>
                                <br />
                                Поиск по всем предметам может занять до 10 секунд
                                <br />
                                Для более быстрого результата попробуйте уточнить предмет поиска
                                <br />
                            </b>
                        </span>
                    </>
                }
                <br />
                {searching &&
                    <>
                        <CircularProgress style={{ marginTop: '50px' }} />
                        <h5>Загрузка, подождите...</h5>
                    </>}
                {notFound && <h4>Ничего не найдено</h4>}
                {results.length > 0 &&
                    <>
                        {results.map(result => (
                            <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={result.id}>
                                <div style={{ width: "100%" }}>
                                    <span style={{ color: "gray" }}>ID: {result.id}</span>
                                    {user.login !== undefined &&
                                        <div style={{ marginTop: "-30px", textAlign: "right" }}><IconButton onClick={(e) => { handleStarTask(e, result) }}>{result.starred === undefined ? <StarBorder /> : <Star />}</IconButton></div>}
                                </div>
                                <b>Предмет: </b> {result.subjectName}<br />
                                <b>Вопрос:</b><br /><span className="dl">{result.question}</span><br />
                                <b>Решение:<b /></b><br /><span className="dl">{result.answer}</span>
                            </Paper>
                        ))}
                        <Button variant="text" onClick={searchNextPage}>Загрузить ещё</Button>
                    </>
                }
            </Paper>
        </>
    )
}

export default Net;