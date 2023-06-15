import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, { payload }) => { // устанавливаются все пользователи
      state.users = [...payload];
    }
  },
});

export const { actions } = usersSlice;
export default usersSlice.reducer;
