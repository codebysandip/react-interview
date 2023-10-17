import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetState } from "src/core/models/common.model";
import { AppDispatch } from "src/redux/create-store";
import { Person } from "../home/home.model";
import { editPersonSuccess } from "../home/home.redux";

export interface ProfileState {
  person?: Person;
  personLoaded?: boolean;
}

const initialState: ProfileState = {};

export const fetchProfile = (id: number) => {
  return (dispatch: AppDispatch, getState: GetState) => {
    const person = getState().home?.persons?.find((p) => p.id === id);
    dispatch(personLoaded(person));
  };
};

export const editPerson = (payload: Person) => {
  return (dispatch: AppDispatch) => {
    dispatch(editPersonSuccess(payload));
    return Promise.resolve(true);
  };
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    personLoaded: (state, action: PayloadAction<Person | undefined>) => {
      state.person = action.payload;
      state.personLoaded = true;
    },
    updatePersonLoadedStatus: (state, action: PayloadAction<boolean>) => {
      state.personLoaded = action.payload;
    },
  },
});

export const { personLoaded, updatePersonLoadedStatus } = profileSlice.actions;
export default profileSlice.reducer;
