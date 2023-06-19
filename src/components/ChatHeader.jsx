import { useTranslation } from "react-i18next";
import { actions } from "../slices/chatSlice";
import arrow from "/arrowLeft.svg";
import { useDispatch } from "react-redux";
import { useModal } from "../hooks";

export const ChatHeader = (props) => { // шапка канала
  const { t } = useTranslation();
  const { showModal } = useModal(); // достаем функцию показа модалки из ее контекста
  const dispatch = useDispatch(); // функция для изменения хранилища
  const { chat } = props; // достаем из пропсов инфу о чате
  const backToChannels = (e) => { // эта функция вернет нас к выбору канала
    e.stopPropagation();
    dispatch(actions.changeChat(null));
  };

  const openModalChatInfo = () => { // при вызове этой функции будет открыта модалка с инфой о чате
    showModal('chatInfo', chat.id);
  };

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small chat-header" onClick={openModalChatInfo}>
      <div className="m-0 d-flex align-items-center">
        <div className="me-1 chats-icon" onClick={backToChannels}> {/* стрелочка и при нажатии на нее мы вернемся к выбору канала */}
          <img src={arrow} />
        </div>
        <b>{chat.name}</b> {/* имя канала */} 
      </div>
      <span className="text-muted">
        {t("chatForm.message", { count: chat.messages.length })} {/* количество сообщений в канале */} 
      </span>
    </div>
  );
};
