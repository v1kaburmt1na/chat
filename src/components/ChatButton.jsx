import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import { Badge } from "react-bootstrap";
import { actions } from "../slices/chatSlice.js";
import { useRef } from "react";
import { useReply } from "../hooks/index.js";

export const ChatButton = (props) => {
  const user = useSelector((state) => state.user);
  const { chats, currentChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const { setReply } = useReply();
  
  const { id, name } = props;
  const isCurrent = id === currentChat;
  const readedMessages = user.chats[id];
  const currentChatObj = chats.find((chat) => chat.id === id);
  const currentChatMessagesLength = currentChatObj.messages.length;
  const countUnreaded = currentChatMessagesLength - readedMessages;
  const lastMessage = currentChatObj.messages.at(-1);
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
  
  const handleChangeChat = () => {
    setReply(null);
    dispatch(actions.changeChat(id)); // изменяем текущий канал
  };

  let msg;
  if (currentChatObj.messages.length > 0) {
    const parsedMsg = JSON.parse(lastMessage.content);
    const removeAllTagsRegexp = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    msg = parsedMsg.replace(removeAllTagsRegexp, '');
  } else {
    msg = 'Сообщений пока нет 😟';
  }


  return (
    <li ref={menuRef} className={classes} onClick={handleChangeChat}>
      <div className="chat-item-wrapper">
        <div className={nameClasses}>{name}</div>
        {readedMessages !== undefined && countUnreaded > 0 ? <Badge className={badgeClassname}>{countUnreaded}</Badge> : null}
      </div>

      <div className="chat-item-msg-wrapper">
        {currentChatObj.messages.length > 0 ? (
          <>
            <span className="author">
              {lastMessage.author.secondName} {lastMessage.author.name[0]}.{" "}
              {lastMessage.author.thirdName[0]}.:
            </span>
            <div className="chat-item-msg">
              {msg}
            </div>
          </>
        ) : (
          <div className="chat-item-msg">
            {msg}
          </div>
        )}
      </div>
    </li>
  );
};
