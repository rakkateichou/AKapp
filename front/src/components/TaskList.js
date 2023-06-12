import { Box, Button, Modal, Paper, Snackbar, Typography } from "@mui/material";
import ky from "ky";
import { useEffect, useState } from "react";
import backendUrl from "../backendUrl";
import TaskPaper from "./TaskPaper";

const TaskList = (props) => {
    // список задач
    const tasks = props.tasks
    const setTasks = props.setTasks

    // удаление задачи
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [taskDelete, setTaskDelete] = useState({})
    const handleDeleteOpen = (task) => {
        setTaskDelete(task);
        setOpenDeleteModal(true);
    }
    const handleDeleteClose = () => setOpenDeleteModal(false);

    // контроль snack
    const [snackDeletedMessage, setSnackDeletedMessage] = useState('');
    const [snackDeletedOpen, setSnackDeletedOpen] = useState(false);
    const showSnackMessage = (message) => { setSnackDeletedMessage(message) }
    useEffect(() => { if (snackDeletedMessage != '') setSnackDeletedOpen(true) }, [snackDeletedMessage])

    const paperStyle = { padding: '50px 20px', width: '70vw', margin: '20px auto' }
    useEffect(() => {
        // загрузка задач с сервера
        if (props.user.id === undefined) props.user.id = -1;
        fetch(`${backendUrl}/local?userId=` + props.user.id).then(resp => resp.json())
            .then((res) => setTasks(res))
        // setTasks([{id: 10, question: "aaa", answer: "vvv", rating: 10}])
    }, []);

    const handleDeleteTask = () => {
        ky.delete(`${backendUrl}/local/${taskDelete.id}`).json().then((data) => {
            console.log(data);
            showSnackMessage(`Удаление вопроса c id ${taskDelete.id}`)
        }).catch((error) => { console.log(error); })
        setTasks(tasks.filter(item => item.taskEntity.id !== taskDelete.id))
        setOpenDeleteModal(false) // in any case
    }

    const boxStyle = {
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    // элемент со списком задач 
    return (<>
        <h2>Все задачи</h2>
        Всего задач в БД - {tasks.length}
        <Paper elevation={3} style={paperStyle}>
            {tasks.length === 0 && <h5>Получение задач с сервера</h5>}
            {tasks.map(task => (
                <TaskPaper key={task.taskEntity.id} response={task} hasRating={props.user.login !== undefined} deletable onDelete={(e) => { handleDeleteOpen(task.taskEntity) }} handleStarTask={(e) => { if (!task.isFavorite) props.handleStarTask(e, task.taskEntity) }} />
            ))}
        </Paper>
        <Modal
            open={openDeleteModal}
            onClose={handleDeleteClose}
        >
            <Box sx={boxStyle}>
                <Typography>Удалить невозвратно?</Typography>
                <div style={{ marginTop: '10px' }}>
                    <Button variant='outlined' onClick={handleDeleteClose}>Нет</Button>
                    <Button variant='contained' style={{ marginLeft: '20px' }} onClick={() => { handleDeleteTask() }}>Да</Button>
                </div>
            </Box>
        </Modal>
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={snackDeletedOpen}
            autoHideDuration={1000}
            onClose={() => { setSnackDeletedOpen(false) }}
            message={snackDeletedMessage}
        />
    </>);
}

export default TaskList;