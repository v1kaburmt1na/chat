import { createSlice } from "@reduxjs/toolkit";

// управление состоянием загрузки данных пользователя 
const mainSlice = createSlice({
  name: "main",
  initialState: {
    isLoading: true
  },
  reducers: {
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    }
  }
});

export const { actions } = mainSlice;
export default mainSlice.reducer;
