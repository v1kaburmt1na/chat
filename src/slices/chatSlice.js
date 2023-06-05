import { createSlice, current } from "@reduxjs/toolkit";
import { notifyUser } from "../api/notifyUser";

const initialState = {
  currentChat: null,
  chats: [],
};

const compareChat = (initialMessages, messages, chatName) => {
  if (messages.length > initialMessages.length) {
    const lastMessage = messages.at(-1);
    notifyUser(lastMessage, chatName);
  }
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, { payload }) => {
      if (payload.length === 0) {
        state.chats = [];
        state.currentChat = null;
        return;
      }

      const currentState = current(state);
      const { id, messages } = payload[0];
      const findedChat = currentState.chats.find((chat) => chat.id === id);

      if (findedChat && id !== state.currentChat) {
        compareChat(findedChat.messages, messages, findedChat.name);
      }

      state.chats = [...payload];
    },
    changeChat: (state, { payload }) => {
      state.currentChat = payload;
    },
    addDept: (state, { payload }) => {
      const { id, dept } = payload;
      const currentChat = state.chats.find((chat) => chat.id === id);

      if (currentChat) {
        currentChat.haveAccess.push(dept);
      }
    },
    removeDept: (state, { payload }) => {
      const { id, dept: currentDept } = payload;
      const currentChat = state.chats.find((chat) => chat.id === id);

      if (currentChat) {
        const newHaveAccessArr = currentChat.haveAccess.filter(
          (dept) => dept !== currentDept
        );
        currentChat.haveAccess = newHaveAccessArr;
      }
    },
    setDefaultChat: (state) => {
      state.currentChat = null;
    }
  },
});

export const { actions } = chatSlice;
export default chatSlice.reducer;
