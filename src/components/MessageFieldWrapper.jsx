import { MessageField } from "./MessageField";
import { useReply } from "../hooks";
import { Reply } from "./Reply";

export const MessageFieldWrapper = (props) => {
  const { currentChat, handleClickScroll } = props;
  const { reply } = useReply();

  if (!reply) {
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
