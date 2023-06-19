import { Fragment, useState, useRef, forwardRef, useEffect, useLayoutEffect } from "react";
import { groupDate } from "../utils/groupDate";
import { Message } from "./Message";
import { useSelector } from "react-redux";

export const Messages = forwardRef((props, ref) => {
  const { chat, setShowScrollBtn } = props; // берем объект чата из пропсов и функцию показа скролла вниз
  const user = useSelector((state) => state.user); // берем юзера из хранилища
  const { messages, id: chatId } = chat; // достаем сообщениЯ и id чата из чата
  const lastReadedMessage = user.chats[chat.id]; // достаем последнее прочитанное сообщение
  const groupMessages = groupDate(messages); // группируем сообщения
  const readedCount = user.chats[chatId]; // смотрим скок у этого юзера прочитано сообщенений в этом чате
  const [reply, setReply] = useState(false); // создаем состояние хранящее сообщение, до которого необходимо заскролить
  const alreadyScrolled = useRef(false); // был ли первый скролл в этом чате
  const lastReadedRef = useRef(null); // последнее прочитанное сообщение

  useEffect(() => {
    const lastReaded = lastReadedRef.current;
    if (lastReaded) {
      lastReaded.scrollIntoView(); // скролл до последнего прочитанного
    }

  }, [lastReadedRef.current]); // хук вызывается если изменилось последнее прочитанное сообщение

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 h-100">
      {groupMessages.map((group) => { // раскрываем группы сообщений
        const { formattedDate, messages: groupMessages } = group; // достаем форматированную дату и массив сообщений
        return (
          <Fragment key={formattedDate}>  { /* выделяем элемент массива среди братьев */}
            <span className="text-center d-block mb-2">{formattedDate}</span> {/* дата */}
            <div className="messages-wrapper" ref={ref}> {/* сообщения, связанные с этой датой */}
              {groupMessages.map((message) => { // отрисовываем сообщения в этой группе
                const isLastReadedMessage = // является ли это сообщение последним прочитанным
                  message.number === lastReadedMessage;
                let canScroll = false; // флаг для того нужно ли скроллить до именно этого сообщения
                if (isLastReadedMessage && !alreadyScrolled.current) { // если это последнее прочитанное сообщение И до этого не было скролла в этом чате
                  alreadyScrolled.current = true; // тогда говорим, что скролл был
                  canScroll = true; // даем возможность скроллить
                }
                return (
                  <Message
                    ref={
                      canScroll ? lastReadedRef : null // если можно скроллить - передаем этому элементу ref и скроллим до него
                    }
                    key={message.item.id} // выделяем сообщение среди братьев
                    readedCount={readedCount} // количество прочитанных сообщений юзера в этом чате
                    chatId={chatId} // id чата
                    userId={user.id} // id юзера
                    message={message} // само сообщение
                    isLast={message.number === messages.length} // является ли сообщение, которое мы рендерим последним
                    setShowScrollBtn={setShowScrollBtn}
                    setReply={setReply} // функция, которая говорит до какого сообщения необходимо скроллить
                    scrollReply={reply} // сообщение, до которого необходимо скроллить
                  />
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
});
