import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import departmentReducer from './departmentSlice';
import usersReducer from './usersSlice';
import mainReducer from './mainSlice';

export default configureStore({ // Конфигурируем общее хранилище, передаем туда редьюсеры
  reducer: {
    user: userReducer,
    chat: chatReducer,
    department: departmentReducer,
    users: usersReducer,
    main: mainReducer
  },
});
