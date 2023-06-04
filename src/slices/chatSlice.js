import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
  chats: [],
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
