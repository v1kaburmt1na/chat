import { Button } from 'react-bootstrap';
import React from 'react';
import { useAuth } from '../hooks/index.js';
import { useDispatch } from 'react-redux';
import { actions } from '../slices/userSlice.js';

function ExitButton({ children }) { // Берем из пропсов children (это содержимое нашего тэга)
  const auth = useAuth(); // Вызываем хук авторизации
  const dispatch = useDispatch();
  const username = localStorage.getItem('username'); // Получаем значение userId из localStorage
  const handleClick = () => {
    auth.logOut();
    dispatch(actions.logout());
  };
  if (auth.loggedIn && username) { // ( Если пользователь залогинен
    // или у него есть userId ) и у него есть токен, то показываем кнопку ВЫЙТИ.
    return (
      <Button onClick={handleClick}>{children}</Button>
    );
  }

  return null;
}

export default ExitButton;
