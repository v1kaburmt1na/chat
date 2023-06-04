import React, { useEffect, useRef } from 'react';
import { Formik } from 'formik';
import {
  Modal, FormGroup, FormControl, Button, FormLabel,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createChat } from '../../services/chat.js';

const generateOnSubmit = (onHide, name, buttonRef) => {
  buttonRef.current.setAttribute('disabled', ''); // отключаем возможность нажатия на кнопку
  createChat({ name }); // регистрируем событие сокета на создание канала (передаем туда название канала)
  onHide(); // вызываем функцию которая должна сработать при закрытии модального окна
};

function Add(props) {
  const { t } = useTranslation(); // функция, которая осуществляет перевод
  const { onHide } = props;
  // берем из пропсов функцию для закрытия модалки и каналы для проверки на уникальность
  const inputRef = useRef(); // нужно для фокуса при открытии
  const buttonRef = useRef(); // нужно для проставления атрибута "disabled" при нажатии

  useEffect(() => {
    inputRef.current.focus(); // фокус на поле
  }, []);

  // TODO: Подумать
  const feedbackStyle = { // инлайн-стили 
    display: 'block',
  };

  return (
    <Modal show onHide={onHide}>
      { /* Компонент модалки, сразу ставим проп show = true чтоб показывать */ }
      <Modal.Header closeButton onHide={onHide}>
        { /* Обертка, которой добавляем кнопку и добавляем обработчик на закрытие */ }
        <Modal.Title>Добавить канал</Modal.Title>
        { /* заголовок модалки */ }
      </Modal.Header>

      <Modal.Body>
        <Formik
          onSubmit={({ name }, actions) => { // деструктуризируем, получаем name и экшены
            if (name === '') { // проверяем пустое ли название
              actions.setFieldError('name', t('errors.required')); // отображаем ошибку
              return;
            }

            generateOnSubmit(onHide, name, buttonRef);// вызываем функцию для отправки формы
          }}
          initialValues={{ // дефолтное значение поля
            name: '',
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
          }) => (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormControl
                  ref={inputRef}
                  onChange={handleChange}
                  value={values.name}
                  data-testid="input-body"
                  name="name"
                  className="mb-2"
                  isInvalid={!!errors.name} // проверяем действительно ли поле не валидно
                />
                <FormLabel htmlFor="name" visuallyHidden>Имя канала</FormLabel>
                { /* для скрин ридеров, а так оно не видно */ }
              </FormGroup>
              <div className="invalid-feedback" style={feedbackStyle}>{errors.name}</div>
              { /* этот тэг будет отображаться если у нас
              ошибка и класс invalid-feedback сделаем текст красным */ }
              <div className="d-flex justify-content-end">
                <Button type="button" className="me-2" onClick={onHide} variant="secondary">Отменить</Button>
                { /* вешаем обработчик закрытия формы при клике */}
                <Button type="submit" ref={buttonRef} variant="primary">Отправить</Button>
                { /* кнопка для отправки формы */ }
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default Add;
