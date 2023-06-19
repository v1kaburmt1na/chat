import { useSelector } from "react-redux";
import { Messages } from "./Messages";
import { useRef, useState } from "react";
import arrowDown from "/arrowDown.svg";
import { ChatHeader } from "./ChatHeader";
import { MessageFieldWrapper } from "./MessageFieldWrapper.jsx";

export const Chat = () => { // компонент канала
  const { currentChat, chats } = useSelector((state) => state.chat); // берем текущий чат и все чаты
  const [showScrollBtn, setShowScrollBtn] = useState(false); // создаем состояние показывать ли кнопку скролла
  const messagesRef = useRef(null); // ссылка на элемент с сообщениями
  const handleClickScroll = () => { // при вызове функции она будет скроллить до последнего элемента
    const messagesRefCurrent = messagesRef.current;

    if (messagesRefCurrent) {
      messagesRefCurrent.lastChild.scrollIntoView(); // скролл до последнего элемента
      setShowScrollBtn(false); // убираем кнопку скролла
    }
  };
  const currentChatObj = chats.find((chat) => chat.id === currentChat); // по id находим объект текущего чата
  if (!currentChat || !currentChatObj) { // если нет текущего чата, то говорим юзеру выбрать канал
    return (
      <div className="choose-channel-wrapper">
        <div className="bg-white rounded choose-channel">
          <p className="m-0">Выберите канал</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col p-0 h-100 bg-white position-relative">
      <div className="d-flex flex-column h-100">
        <ChatHeader chat={currentChatObj} />
        <Messages
          ref={messagesRef}
          chat={currentChatObj}
          setShowScrollBtn={setShowScrollBtn}
        />
        <MessageFieldWrapper
          handleClickScroll={handleClickScroll}
          currentChat={currentChat}
        />
      </div>
      {showScrollBtn && (
        <div onClick={handleClickScroll} className="circle">
          <img src={arrowDown} />
        </div>
      )}
    </div>
  );
};
