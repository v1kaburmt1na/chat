import React, { useState, useEffect } from "react";
import { Chat } from "../components/Chat.jsx";
import { ButtonAddChat } from "../components/ButtonAddChat.jsx";
import { ChatList } from "../components/ChatList.jsx";
import { Modal } from "../components/modals/Modal.jsx";
import { UserData } from "../components/UserData.jsx";
import cn from "classnames";
import { useSelector } from "react-redux";
import { ReplyContext } from "../contexts/index.js";

function ChatPage() {
  const { currentChat } = useSelector((state) => state.chat); // достаем из хранилища текущий чат
  const [reply, setReply] = useState(null); // создаем состояние ответа на сообщение
  const [isMobile, setIsMobile] = useState(document.documentElement.scrollWidth <= 768); // создаем состояние ширины экрана юзера - если менее 768, то с телефона

  useEffect(() => {
    window.onresize = () => { // на изменение ширины окна
      setIsMobile(document.documentElement.scrollWidth <= 768); // изменяем состояние ширины экрана
    };
    
    return () => {
      window.onresize = null; // при удалении компонента - удаляем обработчик с окна браузера
    };
}, []); // хук вызовется при первом рендеринге компонента

  const user = useSelector((state) => state.user); // достаем юзера из хранилища
  const outterClassnames = cn(
    "container chat-page__inner my-4 overflow-hidden",
    {
      rounded: currentChat,
    }
  );

  const innerClassnames = cn(
    "col-4 chat-side border-end px-0 bg-light left-panel",
    {
      rounded: !currentChat,
    }
  );

  const replyCtxValue = {
    reply,
    setReply,
  }; // контекст ответа на сообщение

  return (
    <ReplyContext.Provider value={replyCtxValue}> { /* передаем значения ответа на сообщение в проп value */ }
      <div className="chat-page">
        <div className={outterClassnames}>
          {isMobile ? ( // если зашли с мобильного устройства - показываем ЛИБО список каналов, ЛИБО чат
            <div className="row h-100 flex-md-row flex-nowrap">
              {!currentChat ? (
                <div className={innerClassnames}>
                  <UserData user={user} position="start" /> { /* информация о юзере */ }
                  <div className="d-flex justify-content-between channels">
                    <span>Каналы</span>
                    <ButtonAddChat /> { /* кнопка добавить чат */ }
                  </div>
                  <ChatList /> { /* список каналов */ }
                </div>
              ) : (
                <Chat /> // сам канал
              )}
            </div>
          ) : (
            <div className="row h-100 flex-md-row flex-nowrap">
              <div className={innerClassnames}>
                <UserData user={user} position="start" /> { /* информация о юзере */ }
                <div className="d-flex justify-content-between channels">
                  <span>Каналы</span>
                  <ButtonAddChat /> { /* кнопка добавить чат */ }
                </div>
                <ChatList /> { /* список каналов */ }
              </div>
              <Chat /> { /* сам канал */ }
            </div>
          )}
        </div>
        <Modal /> { /* рендерим модалку */ }
      </div>
    </ReplyContext.Provider>
  );
}

export default ChatPage;
