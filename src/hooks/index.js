import { useContext } from 'react';

import { authContext, ModalContext, ReplyContext } from '../contexts/index.js';

export const useAuth = () => useContext(authContext); // Создадим кастомный хук для
// обработки контекста авторизации
export const useModal = () => useContext(ModalContext); // Создадим хук для просмотра инфы о модалках

export const useReply = () => useContext(ReplyContext); // Создадим хук для просмотра инфы об ответе на сообщ