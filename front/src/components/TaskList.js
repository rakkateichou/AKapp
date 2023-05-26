import { Paper } from "@mui/material";
import ky from "ky";
import { useEffect, useState } from "react";
import backendUrl from "../backendUrl";

const TaskList = () => {
    // список задач
    const [tasks, setTasks] = useState([]);
    const [numOfTasks, setNumOfTasks] = useState(0);
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    useEffect(() => {
        // загрузка задач с сервера
        fetch(`${backendUrl}/local/all`).then(resp => resp.json())
            .then((res) => setTasks(res))
    }, []);
    // элемент со списком задач 
    return (<>
        <h2>Все задачи</h2>
        Всего задач в БД - {tasks.length}
        <Paper elevation={3} style={paperStyle}>
            {tasks.map(task => (
                <Paper elevation={6} style={{margin:"10px", padding:"15px", textAlign:"left"}} key={task.id}>
                    <span style={{color: "gray"}}>ID: {task.id}</span><br/>
                    <b>Вопрос:</b><br/>{task.question}<br/>
                    <b>Ответ:<b/></b><br/>{task.answer}
                </Paper>
            ))}
        </Paper>
    </>);
}

export default TaskList;