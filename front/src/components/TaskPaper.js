import { Delete, Star, StarBorder } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";

// элемент задачи
const TaskPaper = (props) => {
    const sr = props.response
    const [starred, setStarred] = useState(false);
    const [stars, setStars] = useState(sr.favoriteCount - 1);
    useEffect(() => {
        setStars(stars + 1)
    }, [starred])
    return (
        <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }}>
            <div style={{ width: "100%" }}>
                <span style={{ color: "gray" }}>ID: {sr.taskEntity.id}</span>
                {props.isNet &&
                <>
                <br/><span style={{ color: "gray" }}>Предмет: {sr.taskEntity.subjectName}</span>
                </>
                }
                {(props.hasRating || props.deletable) &&
                    <div style={{ marginTop: "-30px", textAlign: "right" }}>
                        {/* если доступен рейтинг */}
                        {props.hasRating &&
                            <span style={{ marginRight: '10px' }}>
                                <IconButton onClick={(e) => { if (!starred) {props.handleStarTask(e) }; setStarred(true) }}>{(sr.isFavorite || starred) ? <Star /> : <StarBorder />}
                                </IconButton>
                                {stars}
                            </span>
                        }
                        {/* если доступно удаление */}
                        {props.deletable &&
                            <IconButton onClick={(e) => { props.onDelete(e) }}>
                                <Delete />
                            </IconButton>
                        }
                    </div>
                }
            </div>
            <b>Вопрос:</b><br />{sr.taskEntity.question}<br />
            <b>Ответ:<b /></b><br />{sr.taskEntity.answer}
        </Paper>
    );
}

export default TaskPaper;