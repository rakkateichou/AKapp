import { Paper } from "@mui/material";
import { useEffect, useState } from "react";

const TaskList = () => {
    // список задач
    const [tasks, setTasks] = useState([]);
    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    useEffect(() => {
        // закгрузка задач с сервера
        fetch("http://localhost:8080/local/all").then(resp => resp.json())
            .then((res) => setTasks(res))
    }, []);
    // элемент со списком задач 
    return (<>
        <h2>Все задачи</h2>
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