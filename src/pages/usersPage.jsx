import { useState } from "react";
import { UserList } from "../components/UserList";
import { UserInfo } from "../components/UserInfo";
import { Modal } from "../components/modals/Modal";

export const UsersPage = () => {
  const [currentUser, setCurrentUser] = useState(); // создаем состояние текущего юзера, которого мы сейчас редактируем, добавляем, удаляем

  return (
    <>
      <div className="users-page">
        <div className="container">
          <div className="users-wrapper">
            <div className="users-inner rounded shadow">
              <UserList setUser={setCurrentUser} /> { /* передаем функцию для изменения текущего юзера */ }
              <UserInfo setUser={setCurrentUser} user={currentUser} /> { /* передаем функцию для изменения текущего юзера и самого юзера */ }
            </div>
          </div>
        </div>
      </div>
      <Modal /> { /* рендерим модалку */ }
    </>
  );
};
