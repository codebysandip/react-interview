import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./app.model";
import { Toaster } from "./core/models/toaster.model";

const initialState: AppState = {};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Toaster>) => {
      state.toast = action.payload;
    },
  },
});

export const { showToast } = appSlice.actions;
export default appSlice.reducer;
