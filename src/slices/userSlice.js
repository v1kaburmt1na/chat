import { createSlice } from "@reduxjs/toolkit";
import { nullUser } from "../utils/nullUser";

const setUser = (state, payload) => {
  const entries = Object.entries(payload);
  for (const [key, value] of entries) {
    state[key] = value;
  }
}; // устанавливает значения по ключу

const userSlice = createSlice({
  name: "user",
  initialState: nullUser,
  reducers: {
    logout: (state) => {
      for (const key of Object.keys(state)) {
        state[key] = nullUser[key]; // ставим дефолтные значения
      }

      localStorage.removeItem('username'); // удаляем из localstorage логин
      localStorage.removeItem('password'); // удаляем из localstorage пароль
    },
    setUser: (state, { payload }) => {
      setUser(state, payload);
    }
  }
});

export const { actions } = userSlice;
export default userSlice.reducer;
