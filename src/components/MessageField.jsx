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
  const { currentChat, handleClickScroll } = props; // достаем из пропсов текущий чат и функцию для скролла до последнего сообщения
  const { reply, setReply } = useReply(); // достаем из хука информацию о том на какое сообщение идет ответ и функцию для изменение этого сообщения
  const user = useSelector((state) => state.user); // достаем юзера
  const { t } = useTranslation(); // достаем функцию для локализации
  const formRef = useRef(null); // ссылка на элемент формы
  const handleSubmit = ({ body }) => { // функция, которая вызовится при отправки сообщения
    formik.values.body = ""; // очистим поле ввода сообщения после отправки
    if (body.trim().length < 1) {
      return;
    }

    const filteredMessage = filter.clean(body.trim()); // убираем матерные слова из сообщения и удаляем пробелы
    const saveFormattingMsg = JSON.stringify(filteredMessage); // превращаем сообщение в JSON строку
    const newMessage = { // создаем новый объект сообщения с автором и контентом
      content: saveFormattingMsg,
      author: {
        id: user.id,
      },
    };
    setReply(null); // после отправки сообщения указываем, что сообщение-ответа теперь нет
    addMessage(newMessage, currentChat, reply); // отправляем сообщение
    setTimeout(handleClickScroll, 500); // через 500 миллисекунд скроллим до последнего сообщения
  };

  const formik = useFormik({
    initialValues: {
      // исходные значения
      body: "",
    },
    onSubmit: handleSubmit,
  }); // вызываем хук библиотеки работы с формами формик и ставим начальное значение сообщения - пустая строка

  const handleKeyDown = (event) => { // функция, которая отправит сообщение при нажатии на энтер И при этом не должен быть нажат шифт
    if (event.keyCode === 13 && !event.shiftKey) { // 13 - клавиша энтер
      event.preventDefault(); // останавливаем дефолтное поведение браузера
      handleSubmit(formik.values); // вызываем функцию отправки сообщения
    }
  };

  const fieldClassname = cn("py-1", "message-field", {
    "rounded-2": !reply,
  });

  return (
    <form
      className={fieldClassname}
      noValidate="" // ссылка на элемент формы
      onSubmit={formik.handleSubmit} // на отправку формы вешаем функцию отправки сообщения
      ref={formRef} // ссылка на элемент формы
    >
      <div className="input-group has-validation">
        <textarea
          className="border-0 p-0 ps-2 form-control chat-input"
          onChange={formik.handleChange} // при изменении выполнять функцию formik.handleChange
          value={formik.values.body} // значение сообщения
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          onKeyDown={handleKeyDown} // при нажатии на клавишу клавитуры вызываем переданную функцию
        />
        <button
          className="btn btn-group-vertical send-btn"
          type="submit"
          disabled={formik.values.body === ""} // отключаем возможность нажать если никакое сообщение не написали
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
