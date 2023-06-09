import { Button, Paper, Snackbar, TextField } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import ky from "ky";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import backendUrl from "../backendUrl";
import TaskPaper from "../components/TaskPaper";

// страница поиска задач
const Net = () => {
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    // состояние строки поиска
    const [query, setQuery] = useState('');
    // результаты поиска
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [searching, setSearching] = useState(false);
    const [searchingNewPage, setSearchingNewPage] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [searchingAllSubjects, setSearchingAllSubjects] = useState(true);
    const [subject, setSubject] = useState("");

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

    // поиск задач
    const search = () => {
        var qt = query
        setPage(1)
        setSearching(true)
        setNotFound(false)
        // получение результатов поиска
        ky.get(`${backendUrl}/int`, { searchParams: { query: qt, page: page, subjects: subject, userId: user.id }, timeout: 900000, retry: 3 }).json()
            .then((data) => {
                if (data.length === 0) setNotFound(true)
                console.log(data);
                setResults(data);
                setSearching(false);
            })
    }
    // поиск следующей страницы
    const searchNextPage = () => {
        setSearchingNewPage(true)
        setPage(page + 1)
        ky.get(`${backendUrl}/int`, { searchParams: { query: query, page: page, subjects: subject, userId: user.id }, timeout: 900000, retry: 3 }).json()
            .then((data) => {
                console.log(data)
                setResults(results.concat(data))
                setSearchingNewPage(false)
            })
    }
    // изменение предмета поиска
    const handleChange = (e) => {
        if (e.target.value === "") {
            setSearchingAllSubjects(true);
        } else {
            setSearchingAllSubjects(false);
        }
        setResults([])
        setSubject(e.target.value)
    }

    // добавление задачи в избранное
    const handleStarTask = (e, result) => {
        result.userId = user.id
        ky.put(`${backendUrl}/favorite`, { json: { user: user, favorite: result } }).json().then((data) => {
            console.log(data)
            showSnackMessage(`Вопрос добавлен под id ${result.id}`)
        }).catch((error) => { console.log(error); })
    }

    // элемент поиска
    return (
        <>
            <h2>Поиск задач по вопросу</h2>
            <Paper elevation={3} style={paperStyle}>
                <div>
                    <TextField id="outlined-basic" label="Ваш запрос" variant="outlined" style={{ width: '80%' }} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(ev) => { if (ev.key === 'Enter') search() }} />
                    <Button variant='contained' style={{ width: '15%', marginLeft: '10px', height: '55px' }} onClick={search}>Поиск</Button>
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
                            // <TaskPaper task={result} hasRating={user.login !== undefined} handleStarTask={(e) => handleStarTask(e, result)} />
                            <TaskPaper key={result.taskEntity.id} response={result} hasRating={user.login !== undefined} isNet handleStarTask={(e) => { if (!result.isFavorite) handleStarTask(e, result.taskEntity) }} />
                        ))}
                        <Button variant="text" onClick={searchNextPage}>Загрузить ещё</Button>
                        {searchingNewPage &&
                            <>
                                <br /><CircularProgress style={{ marginTop: '50px' }} />
                            </>
                        }
                    </>
                }
            </Paper>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen}
                autoHideDuration={1000}
                onClose={() => { setSnackOpen(false) }}
                message={snackMessage}
            />
        </>
    )
}

export default Net;