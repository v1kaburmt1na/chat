import { useModal } from "../../hooks";
import getModal from "./index";

export const Modal = () => {
  const { modalInfo, hideModal } = useModal(); // инфу о текущей модалке и функцию для закрытия модалки
  if (!modalInfo.type) {
    // если у модалки нет типа - возвращаем null
    return null;
  }

  const Component = getModal(modalInfo.type); // получаем нужную нам модалку
  return <Component modalInfo={modalInfo} onHide={hideModal} />; // рендерим её
};
