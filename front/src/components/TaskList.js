import { Paper } from "@mui/material";
import ky from "ky";
import { useEffect, useState } from "react";
import backendUrl from "../backendUrl";
import TaskPaper from "./TaskPaper";

const TaskList = () => {
    // список задач
    const [tasks, setTasks] = useState([]);
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    useEffect(() => {
        // загрузка задач с сервера
        //fetch(`${backendUrl}/local/all`).then(resp => resp.json())
        //    .then((res) => setTasks(res))
        setTasks([{id: 10, question: "aaa", answer: "vvv", rating: 10}])
    }, []);

    const handleDeleteTask= (e, task) => {
        ky.delete(`${backendUrl}/local/${task.id}`).json().then((data) => {
            console.log(data);
        }).catch((error) => {console.log(error);})
        setTasks(tasks.filter(item => item.id !== task.id))
    }

    // элемент со списком задач 
    return (<>
        <h2>Все задачи</h2>
        Всего задач в БД - {tasks.length}
        <Paper elevation={3} style={paperStyle}>
            {tasks.map(task => (
                <TaskPaper task={task} hasRating deletable onDelete={(e) => {handleDeleteTask(e, task)}} />
            ))}
        </Paper>
    </>);
}

export default TaskList;