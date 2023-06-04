import { createSlice } from "@reduxjs/toolkit";

export const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    depts: []
  },
  reducers: {
    setDepartments: (state, { payload }) => {
      state.depts = [...payload];
    },
  }
});

export const { actions } = departmentsSlice;
export default departmentsSlice.reducer;