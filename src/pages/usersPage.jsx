import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserList } from "../components/UserList";
import { UserInfo } from "../components/UserInfo";
import { Modal } from "../components/modals/Modal";

export const UsersPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    if (user.access !== "hr-manager") {
      navigate("/");
    }
  }, [user.access]);

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
