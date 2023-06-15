import { createSlice, current } from "@reduxjs/toolkit";
import { notifyUser } from "../api/notifyUser";

const initialState = { // начальное значение сущности чата
  currentChat: null,
  chats: [],
};

const compareChat = (initialMessages, messages, chatName) => {
  if (messages.length > initialMessages.length) { // если в чате, который пришел с сервера больше сообщений чем в том, который в состоянии
    const lastMessage = messages.at(-1); // берем последнее сообщение
    notifyUser(lastMessage, chatName); // уведомляем пользователя
  }
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, { payload }) => { // устанавливает чаты
      if (payload.length === 0) { // устанавливаем норчальное значение чатам
        state.chats = [];
        state.currentChat = null;
        return;
      }

      const currentState = current(state); // получаем состояние
      const { id, messages } = payload[0]; // берем последний измененный чат
      const findedChat = currentState.chats.find((chat) => chat.id === id); // ищем последний измененный чат среди наших

      if (findedChat && id !== state.currentChat) { // если нашли последний измененный чат среди новых И его id не является id currentChat
        compareChat(findedChat.messages, messages, findedChat.name); // сравниваем чаты
      }

      state.chats = [...payload]; // сохраняем новые чаты в состоянии
    },
    changeChat: (state, { payload }) => { // изменяем текущий чат
      state.currentChat = payload;
    },
    addDept: (state, { payload }) => { // добавляем в чат отдел
      const { id, dept } = payload;
      const currentChat = state.chats.find((chat) => chat.id === id); // ищем текущий чат

      if (currentChat) {
        currentChat.haveAccess.push(dept); // в массив отделов, у которых есть доступ добавляем необходимый чат
      }
    },
    removeDept: (state, { payload }) => { // удаляем отдел из чата
      const { id, dept: currentDept } = payload;
      const currentChat = state.chats.find((chat) => chat.id === id); // находим текущий чат

      if (currentChat) { // если он есть - мы фильтруем массив haveAccess, удаляя необходимый отдел
        const newHaveAccessArr = currentChat.haveAccess.filter(
          (dept) => dept !== currentDept
        );
        currentChat.haveAccess = newHaveAccessArr; // обновляем массив haveAccess
      }
    },
    setDefaultChat: (state) => { // при удалении чата ставим текущий null
      state.currentChat = null;
    }
  },
});

export const { actions } = chatSlice;
export default chatSlice.reducer;
