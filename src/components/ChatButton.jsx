import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import { Badge } from "react-bootstrap";
import { actions } from "../slices/chatSlice.js";
import { useReply } from "../hooks/index.js";

export const ChatButton = (props) => { // компонент кнопки, которая выбирает чат
  const user = useSelector((state) => state.user); // достаем юзера из хранилища
  const { chats, currentChat } = useSelector((state) => state.chat); // достаем чаты и текущий чат из хранилища
  const dispatch = useDispatch(); // функция для изменения хранилища чатов
  const { setReply } = useReply(); // достаем функцию изменения ответа на сообщение
  
  const { id, name } = props; // достаем id и имя канала
  const isCurrent = id === currentChat; // смотрим является ли этот канал текущим
  const readedMessages = user.chats[id]; // берем количество прочитанных сообщений у юзера в этом канале
  const currentChatObj = chats.find((chat) => chat.id === id); // ищем объект канала по id
  const currentChatMessagesLength = currentChatObj.messages.length; // берем количество сообщений
  const countUnreaded = currentChatMessagesLength - readedMessages; // вычитаем количество сообщений из количества прочитанных и получаем сколько не прочитал
  const lastMessage = currentChatObj.messages.at(-1); // получаем последнее сообщение в канале
  const classes = cn("nav-item w-100 chat-item", {
    "bg-primary": isCurrent, // если канал текущий, то выделим его определенным цветом
    "chat-item-chosen": isCurrent,
  });
  
  const nameClasses = cn("chat-item-name", {
    "chat-item-name-chosen": isCurrent,
  });
  
  const badgeClassname = cn({
    "bg-secondary": isCurrent
  });
  
  const handleChangeChat = () => { // при нажатии на чат
    setReply(null); // при смене канала сбрасываем сообщение-ответ
    dispatch(actions.changeChat(id)); // изменяем текущий канал
  };

  return (
    <li className={classes} onClick={handleChangeChat}>
      <div className="chat-item-wrapper">
        <div className={nameClasses}>{name}</div> { /* если количество прочитанных сообщений НЕ РАВНО undefined И количество НЕпрочитанных БОЛЕЕ 0 - показываем бейджик с количеством непрочитанных. ИНАЧЕ - ничего */ }
        {readedMessages !== undefined && countUnreaded > 0 ? <Badge className={badgeClassname}>{countUnreaded}</Badge> : null}
      </div>

      <div className="chat-item-msg-wrapper">
        {currentChatObj.messages.length > 0 ? ( // если сообщений в чате больше 0 - показываем ФИО автора сообщения и контент сообщения
          <>
            <span className="author">
              {lastMessage.author.secondName} {lastMessage.author.name[0]}.{" "}
              {lastMessage.author.thirdName[0]}.:
            </span>
            <div className="chat-item-msg">
              {JSON.parse(lastMessage.content).split("\n")} { /* раскрываем сообщение и удаляем переносы */ }
            </div>
          </>
        ) : (
          <div className="chat-item-msg">
            Сообщений пока нет 😟
          </div>
        )}
      </div>
    </li>
  );
};
