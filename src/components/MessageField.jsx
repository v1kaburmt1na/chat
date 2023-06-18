import filter from "leo-profanity";
import { useFormik } from "formik";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { addMessage } from "../services/chat";
import { useSelector } from "react-redux";
import cn from "classnames";
import { useReply } from "../hooks";

filter.add(filter.getDictionary("ru")); // Добавляем русский в библиотеку-цензор матов

export const MessageField = (props) => {
  const { currentChat, handleClickScroll } = props;
  const { reply, setReply } = useReply();
  const user = useSelector((state) => state.user);
  const { t } = useTranslation();
  const formRef = useRef(null);
  const handleSubmit = ({ body }) => {
    formik.values.body = ""; // очистим поле ввода сообщения после отправки
    if (body.trim().length < 1) {
      return;
    }

    const filteredMessage = filter.clean(body.trim());
    const saveFormattingMsg = JSON.stringify(filteredMessage);
    const newMessage = {
      content: saveFormattingMsg,
      author: {
        id: user.id,
      },
    };
    setReply(null);
    addMessage(newMessage, currentChat, reply);
    setTimeout(() => {
      handleClickScroll();
    }, 500);
  };

  const formik = useFormik({
    initialValues: {
      // исходные значения
      body: "",
    },
    onSubmit: handleSubmit,
  });

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(formik.values);
    }
  };

  const fieldClassname = cn("py-1", "message-field", {
    "rounded-2": !reply,
  });

  return (
    <form
      className={fieldClassname}
      noValidate=""
      onSubmit={formik.handleSubmit}
      ref={formRef}
    >
      {" "}
      {/* При отправке формы будет вызвана функция-обработчик */}
      <div className="input-group has-validation">
        <textarea
          className="border-0 p-0 ps-2 form-control chat-input"
          onChange={formik.handleChange}
          value={formik.values.body}
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-group-vertical send-btn"
          type="submit"
          disabled={formik.values.body === ""}
        >
          {" "}
          {/* Заблокировать кнопку если поле пустое */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
            />
          </svg>
          <span className="visually-hidden">{t("buttons.send")}</span>
        </button>
      </div>
    </form>
  );
};
