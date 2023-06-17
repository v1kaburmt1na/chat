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

export const Message = memo(forwardRef((props, ref) => {
  const { userId, message, readedCount, chatId, isLast, setShowScrollBtn, setReply, scrollReply } =
    props;
  const { item, number } = message;
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const msgRef = useRef(null);
  const entry = useIntersectionObserver(msgRef, {});
  const isVisible = !!entry?.isIntersecting;
  const { author, date, content, reply, id } = item;
  const dateObj = new Date(date);
  const hour = formatDate(dateObj.getHours());
  const minutes = formatDate(dateObj.getMinutes());
  const formattedDate = `${hour}:${minutes}`;
  const isMyMessage = author.id === userId;
  const msgClassnames = cn("message", {
    "message-my": isMyMessage,
  });
  useEffect(() => {
    if (isVisible && number > readedCount) {
      const data = {
        user: userId,
        chat: chatId,
        count: number,
      };
      readMessage(data);
      return;
    }

    if (isLast) {
      setShowScrollBtn(!isVisible);
    }

  }, [isVisible]);

  useEffect(() => {
    if (msgRef.current && scrollReply === id) {
      msgRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setReply(null);
    }
  }, [scrollReply]);

  return (
    <>
      <div
        ref={msgRef}
        className="message-outter"
        onContextMenu={(e) => {
          e.preventDefault();
          setIsContextMenuOpen(true);
        }}
      >
        <div ref={ref} className={msgClassnames}>
          <div className="message-inner">
            {!isMyMessage ? <span className="post">{author.post}</span> : null}
            <span className="time">{formattedDate}</span>
          </div>
          {!isMyMessage ? (
            <span className="author">
              {author.secondName} {author.name} {author.thirdName}
            </span>
          ) : null}
          {reply && <MessageReply setReply={setReply} reply={reply} isMyMessage={isMyMessage} />}
          <div className="content" dangerouslySetInnerHTML={{ __html: JSON.parse(content) }} />
          {isContextMenuOpen && (
            <ContextDropdown
              isLast={isLast}
              message={message}
              setIsOpen={setIsContextMenuOpen}
              position={isMyMessage ? "right" : "left"}
            />
          )}
        </div>
      </div>
    </>
  );
}));
