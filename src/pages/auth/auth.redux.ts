import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LS_IS_LOGGED_IN, LS_PASSWORD, LS_USERNAME } from "src/const";
import { AppDispatch } from "src/redux/create-store";
import { LoginPayload } from "./auth.model";

export interface AuthState {
  isLoggedIn: boolean;
  login: {
    errorMessage: string;
  };
}

const initialState: AuthState = {
  isLoggedIn: JSON.parse(localStorage.getItem(LS_IS_LOGGED_IN) || "false"),
  login: {
    errorMessage: "",
  },
};

export const login = (payload: LoginPayload) => {
  return (dispatch: AppDispatch) => {
    if (
      payload.username === localStorage.getItem(LS_USERNAME) &&
      payload.password === localStorage.getItem(LS_PASSWORD)
    ) {
      localStorage.setItem(LS_IS_LOGGED_IN, JSON.stringify(true));
      dispatch(
        loginSuccess({
          isLoggedIn: true,
        }),
      );
    } else {
      dispatch(loginError("Credentials doesn't match"));
    }
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.login.errorMessage = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem(LS_IS_LOGGED_IN);
      localStorage.removeItem(LS_USERNAME);
      localStorage.removeItem(LS_PASSWORD);
    },
  },
});

export const { loginSuccess, logout, loginError } = authSlice.actions;
export default authSlice.reducer;
