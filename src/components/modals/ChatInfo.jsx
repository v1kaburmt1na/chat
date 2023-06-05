import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
  Badge,
  Card,
  Dropdown,
  CloseButton,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";
import { UserData } from "../UserData";
import { useModal } from "../../hooks";

export const ChatInfo = (props) => {
  const { onHide, modalInfo } = props;
  const { item: id } = modalInfo;
  const { showModal } = useModal();
  const { chats } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);
  const currentChatObj = chats.find((chat) => chat.id === id);
  const departments = currentChatObj.haveAccess;
  const { t } = useTranslation();
  const users = useGetAllUsers(departments);

  const editChatHandle = () => {
    showModal('updating', id);
  };

  const removeChatHandle = () => {
    showModal("removing", id)
  };

  return (
    <Modal show onHide={onHide} className="chat-info-modal">
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{currentChatObj.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="chat-info">
          <div className="chat-info-about">
            <span className="text-muted">
              {t("chatForm.user", { count: users.length })}
            </span>
            <span className="text-muted">
              {t("chatForm.message", { count: currentChatObj.messages.length })}
            </span>
          </div>
          <div className="chat-info-badges">
            {departments.map((dept) => (
              <Badge key={dept}>{dept}</Badge>
            ))}
          </div>
          <div className="chat-info-users">
            {users.map((user) => {
              return (
                <div key={user.username} className="chat-info-user">
                  <UserData user={user} position="end" />
                </div>
              );
            })}
          </div>
          {user.access === "chat-operator" ||
            (user.access === "ceo" && (
              <div className="chat-info-manage">
                <div
                  className="chat-info-remove chat-info-btn"
                  onClick={removeChatHandle}
                >
                  Удалить
                </div>
                <div
                  className="chat-info-edit chat-info-btn"
                  onClick={editChatHandle}
                >
                  Изменить
                </div>
              </div>
            ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};
