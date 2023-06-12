import { Button } from 'react-bootstrap';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../slices/userSlice.js';

function ExitButton({ children }) { // Берем из пропсов children (это содержимое нашего тэга)
  const { isAuthorized } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(actions.logout());
  };
  return isAuthorized ? <Button onClick={handleClick}>{children}</Button> : null;
}

export default ExitButton;
