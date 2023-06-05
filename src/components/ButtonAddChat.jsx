import { useSelector } from "react-redux";
import { useModal } from "../hooks";

export const ButtonAddChat = () => {
  // кнопка создания чата
  const { showModal } = useModal(); // функция для открытия модалки
  const user = useSelector((state) => state.user); // берем инфу о юзере
  if (user.access !== "chat-operator" && user.access !== "ceo") {
    // если уровень доступа не равен чат оператору ИЛИ ген. директору, то мы не рисуем эту кнопку
    return null;
  }
  return (
    <button
      className="p-0 text-primary btn btn-group-vertical"
      onClick={() => showModal("adding")} // при нажатии на кнопку - открываем модалку создания нового канала
      type="button"
    >
      {" "}
      {/* клик по кнопке откроет модалку */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="20"
        height="20"
        fill="currentColor"
      >
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
      </svg>
      <span className="visually-hidden">+</span>
    </button>
  );
};
