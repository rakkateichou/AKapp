import { Paper } from "@mui/material";
import ky from "ky";
import { useEffect, useState } from "react";
import backendUrl from "../backendUrl";
import TaskPaper from "./TaskPaper";

const TaskList = (props) => {
    // список задач
    const [tasks, setTasks] = useState([]);
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    useEffect(() => {
        // загрузка задач с сервера
        fetch(`${backendUrl}/local?userId=` + props.user.id).then(resp => resp.json())
           .then((res) => setTasks(res))
        // setTasks([{id: 10, question: "aaa", answer: "vvv", rating: 10}])
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
            {tasks.length === 0 && <h5>Получение задач с сервера</h5>}
            {tasks.map(task => (
                <TaskPaper key={task.taskEntity.id} response={task} hasRating={props.user.login !== undefined} deletable onDelete={(e) => {handleDeleteTask(e, task.taskEntity)}} handleStarTask={(e) => {props.handleStarTask(e, task.taskEntity)}}/>
            ))}
        </Paper>
    </>);
}

export default TaskList;