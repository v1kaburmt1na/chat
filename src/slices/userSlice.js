import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18next from "i18next";
import { nullUser } from "../utils/nullUser";

export const registerUser = createAsyncThunk(
  // Нужен для создания асинхронных запросов
  "user/registerUser", // Название действия
  async (data) => {
    const user = await register(data);
    return user;
  }
);

export const loginUser = createAsyncThunk("user/loginUser", async (data) => {
  const user = await login(data);
  return user;
});

const setUser = (state, payload) => {
  const entries = Object.entries(payload);
  for (const [key, value] of entries) {
    state[key] = value;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: nullUser,
  reducers: {
    logout: (state) => {
      for (const key of Object.keys(state)) {
        state[key] = nullUser[key];
      }
    },
    setUser: (state, { payload }) => {
      setUser(state, payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        setUser(state, payload);
        toast.success(i18next.t("success.register"));
      })
      .addCase(registerUser.rejected, (_state, { error }) => {
        if (error.code === "409") {
          toast.error(i18next.t("errors.exist"));
        }
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        setUser(state, payload);
        localStorage.setItem("username", payload.username);
        localStorage.setItem("password", payload.password);
      })
      .addCase(loginUser.rejected, (_state, { error }) => {
        if (error.code === "403") {
          toast.error(i18next.t("errors.needActivate"));
        } else if (error.code === "404") {
          toast.error(i18next.t("errors.auth"));
        }
      });
  },
});

export const { actions } = userSlice;
export default userSlice.reducer;
