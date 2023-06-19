import { formatDate } from "../utils/formatDate";
import cn from "classnames";
import React, {
  Fragment,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { readMessage } from "../services/user";
import { ContextDropdown } from "./ContextDropdown";
import { MessageReply } from "./MessageReply";

export const Message = memo(forwardRef((props, ref) => { // компонент сообщения
  const { userId, message, readedCount, chatId, isLast, setShowScrollBtn, setReply, scrollReply } =
    props; // достаем данные из пропсов
  const { item, number } = message; // достаем само сообщение и его номер
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false); // открыто ли контекстное меню
  const msgRef = useRef(null); // ссылка на сообщение
  const entry = useIntersectionObserver(msgRef, {}); // вызываем хук, который следит за тем видно ли сейчас сообщение
  const isVisible = !!entry?.isIntersecting; // флаговая переменная видно ли сейчас сообщение
  const { author, date, content, reply, id } = item; // достаем автора, дату отправки, контент, ответ и id сообщения из сообщения
  const dateObj = new Date(date); // получаем объект даты из timestamp
  const hour = formatDate(dateObj.getHours()); // получаем количество часов, когда было отправлено сообщение
  const minutes = formatDate(dateObj.getMinutes()); // получаем количество минут, когда было отправлено сообщение
  const formattedDate = `${hour}:${minutes}`; // форматируем дату
  const messageLines = JSON.parse(content).split("\n"); // делим сообщение по знаку \n, то есть по концу строки
  const isMyMessage = author.id === userId; // смотрим мое ли это сообющение
  const msgClassnames = cn("message", {
    "message-my": isMyMessage,
  });
  useEffect(() => {
    if (isVisible && number > readedCount) { // если сообщение сейчас видно И номер сообщения больше чем юзер прочитал в этом чате
      const data = {
        user: userId,
        chat: chatId,
        count: number,
      };
      readMessage(data); // читаем сообщение
      return;
    }

    if (isLast) { // если это сообщение является последним
      setShowScrollBtn(!isVisible); // вызываем функцию, которая изменяет состояние показа кнопки скролла вниз
    }

  }, [isVisible]); // этот хук будет вызываться если элемент появился/ушел из зоны видимости

  useEffect(() => { // этот хук вызывается при изменении переменной scrollReply
    if (msgRef.current && scrollReply === id) { // id сообщения равен id сообщения, до которого нужно заскролить, то скролим
      msgRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setReply(null); // говорим, что больше не нужно скроллить до элемента
    }
  }, [scrollReply]);

  return (
    <>
      <div
        ref={msgRef}
        className="message-outter"
        onContextMenu={(e) => { // функция, которая изменяет состояния открытия контекстного меню
          e.preventDefault(); // выключаем дефолтное поведение браузера
          setIsContextMenuOpen(true); // изменяем состояние открытия контекстного меню
        }}
      >
        <div ref={ref} className={msgClassnames}>
          <div className="message-inner">
            {!isMyMessage ? <span className="post">{author.post}</span> : null} {/* если сообщение не мое, то показываем должность */}
            <span className="time">{formattedDate}</span> {/* время сообщения */}
          </div>
          {!isMyMessage ? ( // если сообщение не мое, то показываем ФИО
            <span className="author">
              {author.secondName} {author.name} {author.thirdName} {/* ФИО */}
            </span>
          ) : null}
          {reply && <MessageReply setReply={setReply} reply={reply} isMyMessage={isMyMessage} />} {/* если это сообщение является ответом на другое - рисуем компонент */}
          <div className="content">
            {messageLines.map((message, i) => ( // пройдемся по строкам сообщения
              <Fragment key={message + i}>
                {message ? ( // если это сообщение - рисуем сообщение
                  message
                ) : ( // иначе ставим 2 тэга переноса строки
                  <>
                    <br />
                    <br />
                  </>
                )}
              </Fragment>
            ))}
          </div>
          {isContextMenuOpen && ( // если контекстное меню открыто - показываем его
            <ContextDropdown
              isLast={isLast} // является ли это сообщение последним
              message={message} // передаем сообщение
              setIsOpen={setIsContextMenuOpen} // передаем функцию для закрытия меню (будем юзать при нажатии)
              position={isMyMessage ? "right" : "left"} // где отобразить - справо или слева
            />
          )}
        </div>
      </div>
    </>
  );
}));
