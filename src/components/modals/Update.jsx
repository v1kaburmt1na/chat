import React, { useEffect, useRef } from "react";
import { Formik } from "formik";
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
  Badge,
  Card,
  Dropdown,
  CloseButton,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../slices/chatSlice.js";
import { updateChat } from "../../services/chat.js";

function Update(props) {
  const { t } = useTranslation(); // функция для локализации
  const {
    onHide,
    modalInfo
  } = props;
  const { item: id } = modalInfo;
  // берем из пропсов функцию для закрытия модалки, каналы для проверки на уникальность
  // И информацию о модалке (предыдущее имя и id)
  const inputRef = useRef(); // создаем реф для инпута чтоб на нем ловить фокус
  const dispatch = useDispatch(); // этот хук возвращает фунцию, которая будет выполнять действия для хранилища
  const { chats } = useSelector((state) => state.chat);
  const { depts } = useSelector((state) => state.department);
  const currentChatObj = chats.find((chat) => chat.id === id); // получаем необходимый нам чат для изменения
  const haventAccessDept = depts.filter(
    // получаем те отделы, которые НЕ имеют доступ к этому чату
    (dept) => !currentChatObj.haveAccess.includes(dept)
  );

  useEffect(() => {
    inputRef.current.focus(); // ловим фокус на инпуте
  }, []);

  const feedbackStyle = {
    // TODO: убрать
    display: "block",
  };

  const addDeptAccess = (dept) => () => {
    // даем доступ к чату к переданному отделу
    dispatch(actions.addDept({ id, dept }));
  };

  const removeDeptAccess = (dept) => () => {
    // забираем доступ к чату у переданного отдела
    dispatch(actions.removeDept({ id, dept }));
  };

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Изменить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          onSubmit={({ name }, actions) => {
            if (name === "") {
              // если имя пустое - говорим заполнить поле
              actions.setFieldError("name", t("errors.required"));
              return;
            }
            const chatObj = {
              messages: currentChatObj.messages,
              haveAccess: currentChatObj.haveAccess,
              name,
            };

            updateChat(chatObj, id); // обновляем чат
            onHide(); // закрываем модалку
          }}
          initialValues={{
            name: currentChatObj.name,
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <form onSubmit={handleSubmit}>
              <Card.Title className="mb-2">Переименовать канал</Card.Title>
              <FormGroup>
                <FormControl
                  ref={inputRef}
                  onChange={handleChange}
                  value={values.name}
                  data-testid="input-body"
                  name="name"
                  id="name"
                  className="mb-2"
                  isInvalid={!!errors.name}
                />
                <FormLabel htmlFor="name" visuallyHidden>
                  Имя канала
                </FormLabel>
              </FormGroup>
              <div className="invalid-feedback" style={feedbackStyle}>
                {errors.name}
              </div>
              <div className="mt-3">
                <Card.Title className="mb-2">
                  Доступ к чату есть у следующих отделов:{" "}
                </Card.Title>
                {currentChatObj.haveAccess.length > 0 ? ( // если есть отделы с доступом к этому чату - рисуем
                  <div className="d-flex gap-2 flex-wrap py-2">
                    {currentChatObj.haveAccess.map(
                      (
                        dept // проходимся по отделам и рисуем их
                      ) => (
                        <Badge key={dept} className="p-2">
                          <div className="d-flex align-items-center">
                            <span>{dept}</span>
                            <CloseButton
                              variant="white"
                              className="ms-2"
                              onClick={removeDeptAccess(dept)} // при нажатии на кнопку - удалим отдел из чата
                            />
                          </div>
                        </Badge>
                      )
                    )}
                  </div>
                ) : null}
                {haventAccessDept.length > 0 ? ( // если отделов, у которых нет доступа к чату БОЛЬШЕ 0 - рисуем дропдаун и в нем показываеам эти отделы
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                      Добавить отдел
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {haventAccessDept.map((dept) => (
                        <Dropdown.Item onClick={addDeptAccess(dept)} key={dept}>
                          {" "}
                          {/* на клик вешаем добавление отдела */}
                          {dept}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  className="me-2"
                  onClick={onHide} // при клике на отменить - закрываем модалку
                  variant="secondary"
                >
                  Отменить
                </Button>
                <Button type="submit" variant="primary">
                  Отправить
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default Update;
