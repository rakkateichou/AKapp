import TaskSearch from "../components/TaskSearch";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import backendUrl from "../backendUrl";
import ky from "ky";
import { Snackbar } from "@mui/material";

// страница локальных задач
const Local = () => {
    // cookies
    const cookies = new Cookies();
    const [user, setUser] = useState(undefined);

    const [tasks, setTasks] = useState([]);

    // получение информации о пользователе
    useEffect(() => {
        if (cookies.get('user')) setUser(cookies.get('user'));
        else setUser({});
    }, []);

    // контроль snack
    const [snackMessage, setSnackMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const showSnackMessage = (message) => { setSnackMessage(message) }
    useEffect(() => { if (snackMessage != '') setSnackOpen(true) }, [snackMessage])

    // добавление задачи в избранное
    const handleStarTask = (e, result) => {
        result.userId = user.id
        ky.put(`${backendUrl}/favorite`, { json: { user: user, favorite: result } }).json().then((data) => {
            console.log(data)
            showSnackMessage(`Вопрос добавлен в избранное под id ${result.id}`)
        }).catch((error) => { console.log(error); })
    }

    return (
        <>
            {user !== undefined &&
                <>
                    <TaskSearch user={user} handleStarTask={handleStarTask} />
                    <AddTask showSnackMessage={showSnackMessage} tasks={tasks} setTasks={setTasks}/>
                    <TaskList user={user} handleStarTask={handleStarTask} tasks={tasks} setTasks={setTasks}/>
                </>
            }
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen}
                autoHideDuration={1000}
                onClose={() => { setSnackOpen(false) }}
                message={snackMessage}
            />
        </>
    );
}

export default Local;