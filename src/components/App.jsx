import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout.jsx";
import { useAuth } from "../hooks/index.js";
import { ModalContext, authContext } from "../contexts/index.js";
import LoginPage from "../pages/loginPage.jsx";
import ChatPage from "../pages/chatPage.jsx";
import NotFoundPage from "../pages/notFoundPage.jsx";
import { fetchChats } from "../services/chat.js";
import { fetchDepartments } from "../services/department.js";
import { useDispatch, useSelector } from "react-redux";
import { UsersPage } from "../pages/usersPage.jsx";
import { fetchUsers } from "../services/users.js";
import { login } from "../services/user.js";

function AuthProvider({ children }) {
  const dispatch = useDispatch(); // Хук для выполнения действия в redux
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password"); // Возьмем из локального хранилища инфу о токене
  const currentUserState = Boolean(username); // есть ли имя пользователя
  const [loggedIn, setLoggedIn] = useState(currentUserState); // создадим состояние авторизации
  // и её обработчик с дефолтным значением currentUserState

  const logIn = () => setLoggedIn(true); // создадим функцию которая будет нас логинить
  const logOut = () => {
    // создадим функцию которая будет нас выбрасывать из аккаунта
    localStorage.removeItem("username"); // удаляем токен
    localStorage.removeItem("password"); // удаляем юзернейм
    setLoggedIn(false); // разлогиниваем пользователя
  };

  useEffect(() => {
    // Сработает только при загрузке приложения
    if (username && password) {
      const user = {
        username,
        password,
      };
      login(user);
    }
  }, []);

  const memoized = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]); // создаем объект
  // сессии для передачи в контекст
  return (
    <authContext.Provider value={memoized}>{children}</authContext.Provider>
  );
}

const ModalProvider = ({ children }) => {
  const [modalInfo, setModalInfo] = useState({ type: null, item: null }); // Состояние открытой на данный момент модалки
  const hideModal = () => setModalInfo({ type: null, item: null }); // Скрываем модалку
  const showModal = (type, item = null) => setModalInfo({ type, item }); // ПОказываем модалку
  const memoized = useMemo(
    () => ({ modalInfo, hideModal, showModal }),
    [modalInfo]
  ); // Создаем модалку и передаем как дефолтное значение в наш Context API
  return (
    <ModalContext.Provider value={memoized}>{children}</ModalContext.Provider>
  );
};

function PrivateRoute({ children }) {
  const auth = useAuth(); // берем инфу о сессии из контекста

  return auth.loggedIn ? children : <Navigate to="/login" />;
  // если авторизован - выводим страницу, иначе навигируем на страницу логина
}

function App() {
  const { access, department } = useSelector((state) => state.user); // Получаем информацию о юзере из хранилища

  useEffect(() => {
    if (department) {
      // Если отдел есть - запрашиваем чаты для этого отдела
      const context = {
        access,
        department,
      };
      fetchChats(context);
    }
    fetchUsers(access); // Загрузка всех пользователей для страницы сотрудника
    fetchDepartments(); // Загрузка всех отделов
  }, [access, department]);

  return (
    <AuthProvider>
      <ModalProvider>
        {/* Компонент, внутри которого будет доступ к контексту сессии (авторизации)*/}
        {/* Проводим контекст сокета для создания/изменения/удаления канала и отправки сообщений */}
        <Routes>
          {/* Компонент путей */}
          <Route path="/" element={<Layout />}>
            {/* Ставим на путь "/" нашу разметку layout */}
            <Route
              index
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />
            {/* Страница всех пользователей */}
            <Route
              path="users"
              element={
                <PrivateRoute>
                  <UsersPage />
                </PrivateRoute>
              }
            />
            {/* Кладем внутрь компонент PrivateRoute и он следит за авторизацией */}
            <Route path="login" element={<LoginPage />} />
            {/* Страница регистрации */}
            <Route path="*" element={<NotFoundPage />} />
            {/* Все остальные страницы */}
          </Route>
        </Routes>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
