import { ClassNames } from "@emotion/react";
import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import SplashScreen from "../components/SplashScreen";
import Cookies from "universal-cookie";

const Main = (props) => {

  const [isSpashVisible, setSplashIsVisible] = useState(false);

  // cookies
  const cookies = new Cookies();

  useEffect(() => {
    if (cookies.get('splash') !== 'shown') {
      setSplashIsVisible(true);
      const timeout = setTimeout(() => {
        setSplashIsVisible(false);
        cookies.set('splash', 'shown', { path: '/' });
      }, 3900); // splash экран
      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  const handleShowSplash = (e) => {
    cookies.remove('splash')
    window.location.reload()
  }

  // useEffect для загрузки скрипта telegramim_button
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

  // возвращаемый компонент
  return (
    <>
      {isSpashVisible && <SplashScreen />}
      <div className="mainPage" style={{}}>
        <style>{`
        .toolbar {
          display: none
        }`}
        </style>
        <div style={{
          minHeight: "95vh",
          color: 'white',
          fontSize: '20px',
          backgroundImage: 'url("/main-back.png")',
          position: 'relative'
        }}>
          <Appbar cn="main-toolbar" appStyle={{ backgroundColor: "transparent" }} elevation={0} toggleTheme={props.toggleTheme}/>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <p style={{ fontSize: '35px' }}><span className='font-logo'><b>SOTVETIS</b></span> - это база данных ответов на любые вопросы, которые могут возникнуть у студентов во время прохождения их курса обучения.</p>
            <p>Информация собирается как из локальной базы данных, так и с помощью поиска введённых запросов из других источников, находящихся в сети Интернет.</p>
            <div className="admin" style={{ marginTop: '50px' }}>
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
        </div>
        <div style={{ marginTop: "1vh" }} onClick={handleShowSplash}>©SOTVETIS</div>
      </div>
    </>
  );
}

export default Main;