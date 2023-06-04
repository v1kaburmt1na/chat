import { useClickAway } from "@uidotdev/usehooks";
import { Dropdown } from "react-bootstrap";
import cn from "classnames";
import { useReply } from "../hooks";

export const ContextDropdown = (props) => {
  const { setIsOpen, position, message, isLast } = props;
  const { setReply } = useReply();

  const ref = useClickAway(() => {
    setIsOpen(false);
  });

  const handleReplyClick = (e) => {
    e.stopPropagation();
    setReply(message);
    setIsOpen(false);
  };

  const className = cn("ctx-menu", `ctx-menu-${position}`, {
    'ctx-menu-last': isLast
  });

  return (
    <div className={className}>
      <Dropdown.Menu ref={ref} show>
        <Dropdown.Item onClick={handleReplyClick}>Ответить</Dropdown.Item>
      </Dropdown.Menu>
    </div>
  );
};
