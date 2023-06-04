import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import App from './components/App.jsx';
import store from './slices/index.js';
import resources from './locales/index.js';

const initApp = () => {
  i18next // инициализируем интернационализацию
    .use(initReactI18next) // используем реактовскую интернациолизацию
    .init({
      lng: 'ru', // ставим русский язык
      resources, // вставляем импортированный словарь
    });

  return (
    <Provider store={store}>
      {/* проводим наше хранилище */}
      <BrowserRouter>
        {/* проводим наш роутер для перехода по страницам */}
        <App/>
        {/* рендерим наше приложение */}
        <ToastContainer // проводим контейнер для уведомлений пользователя
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </Provider>
  );
};

export default initApp;
