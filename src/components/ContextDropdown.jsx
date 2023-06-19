import { useClickAway } from "@uidotdev/usehooks";
import { Dropdown } from "react-bootstrap";
import cn from "classnames";
import { useReply } from "../hooks";

export const ContextDropdown = (props) => {
  const { setIsOpen, position, message, isLast } = props;
  const { setReply } = useReply(); // достаем из самописного хука функцию для указания сообщение, на которое будет ответ

  const ref = useClickAway(() => { // вызываем хук из сторонней библиотеки, который говорит о том был ли клик ВНЕ элемента
    setIsOpen(false);
  });

  const handleReplyClick = (e) => { // при нажатии на ответить
    e.stopPropagation();
    setReply(message); // устанавливаем сообщение, на которое будет ответ
    setIsOpen(false); // закрываем контекстное меню
  };

  const className = cn("ctx-menu", `ctx-menu-${position}`, {
    'ctx-menu-last': isLast
  });

  return (
    <div className={className}>
      <Dropdown.Menu ref={ref} show>
        <Dropdown.Item onClick={handleReplyClick}>Ответить</Dropdown.Item> { /* вызов функции при клике */ }
      </Dropdown.Menu>
    </div>
  );
};
