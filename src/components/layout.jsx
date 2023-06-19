import { Outlet, Link } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import React from "react";
import { useModal } from "../hooks/index.js";
import ExitButton from "./ExitButton.jsx";
import { useSelector } from "react-redux";

// Этот компонент оборачивает в себе повторяющуюся верстку
function Layout() {
  const { access } = useSelector((state) => state.user); // достаем уровень доступа из юзера
  const modal = useModal(); // достаем объект с модалками из хука модалки
  const deptsHandleClick = () => { // функция, которая откроет модалку управления отделами
    modal.showModal("department");
  };

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm" expand="lg" variant="light" bg="white">
        <Container>
          <Link className="navbar-brand" to="/"> { /* Ссылка на страницу каналов */ }
            Каналы
          </Link>
          {access === "hr-manager" && ( // если уровень доступа равен менджер по персоналу - показываем кнопку для открытия модалки отделов
            <div
              onClick={deptsHandleClick}
              className="navbar-brand dept-modal"
              to="department"
            >
              Отделы
            </div>
          )}
          {access === "hr-manager" && ( // если уровень доступа равен менджер по персоналу - показываем ссылку для страницы сотрудников
            <Link className="navbar-brand" to="users">
              Сотрудники
            </Link>
          )}
          <ExitButton>Выйти</ExitButton> { /* кнопка выйти */ }
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default Layout;
