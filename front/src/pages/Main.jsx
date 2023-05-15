import { ClassNames } from "@emotion/react";
import { useEffect } from "react";

const Main = () => {

  useEffect(() => {
    const script = document.createElement('script');

    script.type = "text/javascript";
    script.src = "//telegram.im/widget-button/index.php?id=@tempssh";
    script.async = true;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    }
  }, []);

  return (
    <div className="mainPage">
      <div style={{ fontSize: '20px', padding: '10px' }}>
        <p>SOTVETIS - это база данных ответов на любые вопросы, которые могут возникнуть у студентов во время прохождения их курса обучения.</p>
        <p>Информация собирается как из локальной базы данных, так и с помощью поиска введённых запросов из других источников, находящихся в сети Интернет.</p>
      </div>
      <div className="admin">
        <a
          href="https://t.me/tempssh"
          target="_blank"
          className="telegramim_button telegramim_shadow"
          style={{
            fontSize: '18px',
            width: '206px',
            background: '#27A5E7',
            boxShadow: '1px 1px 5px #27A5E7',
            color: '#ffffff',
            borderRadius: '15px',
            margin: '0px auto'
          }}
          title="Связаться с администрацией"
        >
          <i></i> Администрация
        </a>
      </div>
    </div>
  );
}

export default Main;