import { useState } from "react";
import { UserList } from "../components/UserList";
import { UserInfo } from "../components/UserInfo";
import { Modal } from "../components/modals/Modal";

export const UsersPage = () => {
  const [currentUser, setCurrentUser] = useState();

  return (
    <>
      <div className="users-page">
        <div className="container">
          <div className="users-wrapper">
            <div className="users-inner rounded shadow">
              <UserList setUser={setCurrentUser} />
              <UserInfo setUser={setCurrentUser} user={currentUser} />
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};
