import TaskSearch from "../components/TaskSearch";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import backendUrl from "../backendUrl";
import ky from "ky";

// страница локальных задач
const Local = () => {
    // cookies
    const cookies = new Cookies();
    const [user, setUser] = useState(undefined);

    // получение информации о пользователе
    useEffect(() => {
        if (cookies.get('user')) setUser(cookies.get('user'));
    }, []);

    // добавление задачи в избранное
    const handleStarTask = (e, result) => {
        result.userId = user.id
        ky.put(`${backendUrl}/favorite`, { json: { user: user, favorite: result } }).json().then((data) => {
            console.log(data)
        }).catch((error) => { console.log(error); })
    }

    return (
        <>
            {user !== undefined &&
                <>
                    <TaskSearch user={user} handleStarTask={handleStarTask} />
                    <AddTask />
                    <TaskList user={user} handleStarTask={handleStarTask} />
                </>
            }
        </>
    );
}

export default Local;