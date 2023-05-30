import { Delete, Star, StarBorder } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";

// элемент задачи
const TaskPaper = (props) => {
    return (
        <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={props.task.id}>
            <div style={{ width: "100%" }}>
                <span style={{ color: "gray" }}>ID: {props.task.id}</span>
                <div style={{ marginTop: "-30px", textAlign: "right" }}>
                    {/* если доступен рейтинг */}
                    {props.hasRating &&
                        <span style={{ marginRight: '10px' }}>
                            <IconButton onClick={(e) => { props.handleStarTask(e) }}>{props.starred === undefined ? <StarBorder /> : <Star />}
                            </IconButton>
                            {props.task.rating}
                        </span>
                    }
                    {props.deletable &&
                        <IconButton onClick={(e) => { props.onDelete(e) }}>
                            <Delete />
                        </IconButton>
                    }
                </div>
            </div>
            <b>Вопрос:</b><br />{props.task.question}<br />
            <b>Ответ:<b /></b><br />{props.task.answer}
        </Paper>
    );
}

export default TaskPaper;