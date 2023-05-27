import { Delete } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";

const TaskPaper = (props) => {
    return (
        <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={props.id}>
            <div style={{ width: "100%" }}>
                <span style={{ color: "gray" }}>ID: {props.id}</span>
                <div style={{ marginTop: "-30px", textAlign: "right" }}>
                    <IconButton onClick={(e) => { props.onDelete(e) }}>
                        <Delete />
                    </IconButton>
                    </div>
            </div>
            <b>Вопрос:</b><br />{props.question}<br />
            <b>Ответ:<b /></b><br />{props.answer}
        </Paper>
    );
}

export default TaskPaper;