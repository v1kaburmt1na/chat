import { Button } from 'react-bootstrap';
import React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../slices/userSlice.js';

function ExitButton({ children }) { // Берем из пропсов children (это содержимое нашего тэга)
  const dispatch = useDispatch(); // функция для изменения хранилища юзера
  const handleClick = () => { // функция, которая завершит сеанс пользователя
    dispatch(actions.logout());
  };
  return <Button onClick={handleClick}>{children}</Button>;
}

export default ExitButton;
