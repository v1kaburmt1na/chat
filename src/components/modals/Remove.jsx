import React from "react";
import { Modal, FormGroup } from "react-bootstrap";
import { removeChat } from "../../services/chat.js";

function Remove(props) {
  const {
    onHide,
    modalInfo: { item },
  } = props; // из пропсов берем функцию для закрытия модалки
  const onSubmit = (e) => {
    e.preventDefault(); // отключаем дефолтное поведение браузера (перезагрузку страницы)
    removeChat(item); // удаляем чат
    onHide(); // скрываем модалку
  }; // в ответ получаем другую функцию, которую мы передаем на submit формы

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          {" "}
          {/* Вешаем функцию обработчик на отправку формы */}
          <FormGroup>
            <p className="lead">Уверены?</p>
            <div className="d-flex justify-content-end">
              <button
                className="me-2 btn btn-secondary"
                onClick={onHide}
                type="button"
              >
                Отменить
              </button>{" "}
              {/* Вешаем функцию для закрытия модалки на кнопку */}
              <button type="submit" className="btn btn-danger">
                Удалить
              </button>
            </div>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Remove;
