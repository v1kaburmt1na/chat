import { MessageField } from "./MessageField";
import { useReply } from "../hooks";
import { Reply } from "./Reply";

export const MessageFieldWrapper = (props) => {
  const { currentChat, handleClickScroll } = props; // достаем из пропсов текущий чат и функцию для скролла до последнего сообщения
  const { reply } = useReply(); // достаем из хука информацию о том на какое сообщение идет ответ

  if (!reply) { // если не выбрано сообщение для ответа - НЕ рисуем компонент ответа
    return (
      <div className="mt-auto px-5 py-3">
        <div className="border rounded-2 no-border">
          <MessageField handleClickScroll={handleClickScroll} currentChat={currentChat} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto px-5 py-3">
      <div className="border rounded-2">
        <Reply />
        <MessageField handleClickScroll={handleClickScroll} currentChat={currentChat} />
      </div>
    </div>
  );
};
