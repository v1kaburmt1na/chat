import { useReply } from "../hooks";

export const Reply = () => {
  const { reply, setReply } = useReply(); // достаем из хука информацию о том на какое сообщение идет ответ и функцию для изменение этого сообщения
  const { content, author } = reply.item; // достаем контент и автора из сообщения 
  const handleCancelReply = (e) => { // функция вызовется при нажатии на крестик и она отменит ответ на сообщение
    e.stopPropagation();
    setReply(null); // отмена ответа на сообщение
  };
  const initials = `${author.secondName} ${author.name[0]} ${author.thirdName[0]}`; // ФИО автора сообщения
  return (
    <div className="reply">
      <div className="reply-main">
        <p className="reply-author text-muted">{initials}</p>
        <p className="reply-content" title={JSON.parse(content)}>{JSON.parse(content)}</p> { /* отрисовываем сам контент И атрибут title покажет нам текст сообщения при наведении на текст */}
      </div>
      <div className="reply-close" onClick={handleCancelReply}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7.536 6.264a.9.9 0 0 0-1.272 1.272L10.727 12l-4.463 4.464a.9.9 0 0 0 1.272 1.272L12 13.273l4.464 4.463a.9.9 0 1 0 1.272-1.272L13.273 12l4.463-4.464a.9.9 0 1 0-1.272-1.272L12 10.727 7.536 6.264Z" />
        </svg>
      </div>
    </div>
  );
};
