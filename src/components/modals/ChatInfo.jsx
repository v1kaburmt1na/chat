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

export const ChatInfo = (props) => { // модалка с инфой о чате
  const { onHide, modalInfo } = props; //  достаем из пропсов функцию для закрытия модалки и информацию о модалке
  const { item: id } = modalInfo; // берем id канала
  const { showModal } = useModal(); // достаем из хука функцию для показа модалки
  const { chats } = useSelector((state) => state.chat); // берем все каналы из хранилища
  const user = useSelector((state) => state.user); // получаем нашего юзера
  const currentChatObj = chats.find((chat) => chat.id === id); // находим среди всех чатов которые у нас есть нужный нам по id
  const departments = currentChatObj.haveAccess; // записываем в переменную отделы у этого канала
  const { t } = useTranslation(); // берем функцию для локализации из хука
  const users = useGetAllUsers(departments); // вызываем хук, который вернет всех юзеров в этих отделах

  const editChatHandle = () => { // функция, которая сработает при нажатии на кнопку изменения
    showModal('updating', id); // показываем модалку изменения канала
  };

  const removeChatHandle = () => { // функция, которая сработает при нажатии на кнопку удаления
    showModal("removing", id) // показываем модалку удаления канала
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
              {t("chatForm.user", { count: users.length })} {/* количество юзеров  */} 
            </span>
            <span className="text-muted">
              {t("chatForm.message", { count: currentChatObj.messages.length })} {/* количество сообщений  */} 
            </span>
          </div>
          <div className="chat-info-badges">
            {departments.map((dept) => ( //  отображаем все отделы 
              <Badge key={dept}>{dept}</Badge>
            ))}
          </div>
          <div className="chat-info-users">
            {users.map((user) => { // отображаем всех юзеров
              return (
                <div key={user.username} className="chat-info-user">
                  <UserData user={user} position="end" />
                </div>
              );
            })}
          </div>
          {user.access === "chat-operator" && (
            <div className="chat-info-manage">
              <div
                className="chat-info-remove chat-info-btn"
                onClick={removeChatHandle} // вешаем на клик функцию удаления канала
              >
                Удалить
              </div>
              <div
                className="chat-info-edit chat-info-btn"
                onClick={editChatHandle} // вешаем на клик функцию изменения канала
              >
                Изменить
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
