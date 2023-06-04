import { useTranslation } from "react-i18next";
import { actions } from "../slices/chatSlice";
import arrow from "/arrowLeft.svg";
import { useDispatch } from "react-redux";
import { useModal } from "../hooks";

export const ChatHeader = (props) => {
  const { t } = useTranslation();
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const { chat } = props;
  const backToChannels = (e) => {
    e.stopPropagation();
    dispatch(actions.changeChat(null));
  };

  const openModalChatInfo = () => {
    showModal('chatInfo', chat.id);
  };

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small chat-header" onClick={openModalChatInfo}>
      <div className="m-0 d-flex align-items-center">
        <div className="me-1 chats-icon" onClick={backToChannels}>
          <img src={arrow} />
        </div>
        <b>{chat.name}</b>
      </div>
      <span className="text-muted">
        {t("chatForm.message", { count: chat.messages.length })}
      </span>
      {/* Отрисовка количества сообщений */}
    </div>
  );
};
