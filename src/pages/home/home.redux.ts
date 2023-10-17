import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetState } from "src/core/models/common.model";
import { AppDispatch } from "src/redux/create-store";
import { AddPersonPayload, Person } from "./home.model";

function randomId() {
  return Math.floor(Math.random() * 10000);
}
export const PERSONS: Person[] = [
  {
    id: randomId(),
    name: "Sandip Jaiswal",
    age: 31,
  },
  {
    id: randomId(),
    name: "John Doe",
    age: 26,
  },
  {
    id: randomId(),
    name: "Salman Ahmad",
    age: 35,
  },
];
export interface HomeState {
  persons: Person[];
  personsLoaded: boolean;
}

export const fetchPersons = () => {
  return (dispatch: AppDispatch, getState: GetState) => {
    // if persons exist don't load again, otherwise edit or newly added values will not visible
    if (getState().home.persons.length) {
      return;
    }
    dispatch(personsLoaded(PERSONS));
  };
};

const initialState: HomeState = {
  persons: [],
  personsLoaded: false,
};

export const savePerson = (payload: AddPersonPayload) => {
  return async (dispatch: AppDispatch) => {
    dispatch(personAdded(payload));
    return Promise.resolve(true);
  };
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    personsLoaded: (state, action: PayloadAction<Person[]>) => {
      state.persons = action.payload;
      state.personsLoaded = true;
    },
    personAdded: (state, action: PayloadAction<AddPersonPayload>) => {
      state.persons = [
        ...state.persons,
        { id: randomId(), ...action.payload, age: +action.payload.age },
      ];
    },
    // [TODO] handle error case also
    editPersonSuccess: (state, action: PayloadAction<Person>) => {
      state.persons = [
        ...state.persons.filter((p) => p.id !== action.payload.id),
        { ...action.payload },
      ];
    },
  },
});

export const { personsLoaded, personAdded, editPersonSuccess } = homeSlice.actions;
export default homeSlice.reducer;
