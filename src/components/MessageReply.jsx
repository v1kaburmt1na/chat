import cn from 'classnames';

export const MessageReply = (props) => {
  const { reply, isMyMessage, setReply } = props; // достаем сообщение, на которое ответили, является ли это сообщение моим и функцию, которая укажет до какого сообщения нужно проскроллить
  const { author, content, id } = reply; // берем автора, контент и id сообщения из сообщения, на которое ответили 
  const className = cn('reply-message', {
    my: isMyMessage
  });

  return (
    <div className={className} onClick={() => setReply(id)}> { /* на клик устанавливаем сообщение, до которого нужно проскроллить */}
      <span className="author">
        {author.secondName} {author.name[0]} {author.thirdName[0]} {/* ФИО */}
      </span>
      <div className="content">
        {JSON.parse(content)} {/* Контент */}
      </div>
    </div>
  );
};
