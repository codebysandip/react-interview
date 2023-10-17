import { RootState } from "src/redux/create-store";
import { HttpClient } from "../services/http-client";

export interface GetState {
  (): RootState;
}

export type ThunkApi = typeof HttpClient;
