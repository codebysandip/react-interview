import { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { showToast } from "src/app.redux";
import { INTERNET_NOT_AVAILABLE, ROUTE_LOGIN } from "src/const";
import { useAppDispatch, useAppSelector } from "src/core/hook";
import { CompModule, CompModuleImport, IRoute } from "src/core/models/route.model";
import { HttpClient, isOnline, retryPromise } from "src/core/services/http-client";
import { replaceReducer } from "src/redux/create-store";
import { Loader } from "../loader/loader.comp";

/**
 * Lazy Load Route Component
 *
 * @param props {@link LazyProps}
 * @returns Route Component or Loading Component
 */
export default function LazyRoute(props: LazyProps) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [Comp, setComp] = useState<CompModule | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { route } = props;
    if (route.private) {
      if (!isLoggedIn) {
        navigate(ROUTE_LOGIN);
        return;
      }
    }
    retryPromise(isOnline, 1000, HttpClient.maxRetryCount)
      .then(() => {
        props.moduleProvider().then((moduleObj) => {
          if (moduleObj.reducer) {
            replaceReducer(store, moduleObj.reducer as any);
          }
          setComp(moduleObj);
        });
      })
      .catch(() => {
        dispatch(
          showToast({
            type: "error",
            message: INTERNET_NOT_AVAILABLE,
          }),
        );
      });

    // show loader while lazy load component
    setComp(null);
  }, [location.pathname]);

  if (Comp) {
    return <Comp.default />;
  }
  return <Loader />;
}

export interface LazyProps {
  moduleProvider: CompModuleImport;
  route: IRoute;
}
