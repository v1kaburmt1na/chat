import { createContext } from 'react';

// получения информации о сессии в компонентах
export const ModalContext = createContext({}); // Создадим контекст с информацией о текущей модалке

export const ReplyContext = createContext({});