import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Main = () => {
    return ( 
        <div style={{fontSize: '20px', padding: '10px'}}>
        <p>SOTVETIS - это база данных ответов на любые вопросы, которые могут возникнуть у студентов во время прохождения их курса обучения.</p>
        <p>Информация собирается как из локальной базы данных, так и с помощью поиска введённых запросов из других источников, находящихся в сети Интернет.</p>
        {/* <Link to="/db">
            <Button variant="contained" style={{marginBottom: '15px'}}>Локальная база данных</Button>
        </Link>
        <br/>
        <Link to="net">
            <Button variant="contained">Интернет источники</Button>
        </Link> */}
      </div>
     );
}
 
export default Main;