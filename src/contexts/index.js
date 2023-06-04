import { createContext } from 'react';

export const authContext = createContext({}); // Создадим контекст авторизации для
// получения информации о сессии в компонентах
export const ModalContext = createContext({}); // Создадим контекст с информацией о текущей модалке

export const ReplyContext = createContext({});