import { AuthState } from "pages/auth/auth.redux";
import { HomeState } from "pages/home/home.redux";
import { AppState } from "src/app.model";
import { ProfileState } from "src/pages/profile/profile.redux";

export interface RootState {
  home: HomeState;
  auth: AuthState;
  app: AppState;
  profile: ProfileState;
}
