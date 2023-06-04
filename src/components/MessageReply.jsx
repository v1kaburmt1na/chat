import cn from 'classnames';

export const MessageReply = (props) => {
  const { reply, isMyMessage, setReply } = props;
  const { author, content, id } = reply;
  const className = cn('reply-message', {
    my: isMyMessage
  });

  return (
    <div className={className} onClick={() => setReply(id)}>
      <span className="author">
        {author.secondName} {author.name[0]} {author.thirdName[0]}
      </span>
      <div className="content">
        {JSON.parse(content)}
      </div>
    </div>
  );
};
