import { Outlet, Link } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import React from "react";
import { useAuth, useModal } from "../hooks/index.js";
import ExitButton from "./ExitButton.jsx";
import { useSelector } from "react-redux";

// Этот компонент оборачивает в себе повторяющуюся верстку
function Layout() {
  const user = useSelector((state) => state.user);
  const auth = useAuth();
  const modal = useModal();
  const deptsHandleClick = () => {
    modal.showModal("department");
  };

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm" expand="lg" variant="light" bg="white">
        <Container>
          <Link className="navbar-brand" to="/">
            Каналы
          </Link>
          {(user.access === "chat-operator") && (
            <div
              onClick={deptsHandleClick}
              className="navbar-brand dept-modal"
              to="department"
            >
              Отделы
            </div>
          )}
          {(user.access === "hr-manager") && (
            <Link className="navbar-brand" to="users">
              Сотрудники
            </Link>
          )}
          <ExitButton>Выйти</ExitButton>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default Layout;
