import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout.jsx";
import { ModalContext } from "../contexts/index.js";
import LoginPage from "../pages/loginPage.jsx";
import ChatPage from "../pages/chatPage.jsx";
import NotFoundPage from "../pages/notFoundPage.jsx";
import { fetchChats } from "../services/chat.js";
import { fetchDepartments } from "../services/department.js";
import { useSelector } from "react-redux";
import { UsersPage } from "../pages/usersPage.jsx";
import { fetchUsers } from "../services/users.js";
import { login } from "../services/user.js";
import { useLayoutEffect } from "react";
import { Ring } from "@uiball/loaders";

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
  const { isAuthorized } = useSelector((state) => state.user);

  return isAuthorized ? children : <Navigate to="/login" />;
  // если авторизован - выводим страницу, иначе навигируем на страницу логина
}

const PrivateRouteEmployers = ({ children }) => {
  const { access, isAuthorized } = useSelector((state) => state.user);

  return access === "hr-manager" && isAuthorized ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  const { access, department } = useSelector((state) => state.user); // Получаем информацию о юзере из хранилища
  const { isLoading } = useSelector((state) => state.main);

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

  useLayoutEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    const user = {
      username,
      password,
    };

    login(user);
  }, []);

  return isLoading ? (
    <div className="full">
      <Ring size={40} />
    </div>
  ) : (
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
              <PrivateRouteEmployers>
                <UsersPage />
              </PrivateRouteEmployers>
            }
          />
          {/* Кладем внутрь компонент PrivateRoute и он следит за авторизацией */}
          {/* Страница регистрации */}
          {/* Все остальные страницы */}
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ModalProvider>
  );
}

export default App;
