import { useRef } from "react";
import {
  Location,
  NavigateFunction,
  NavigateOptions,
  Params,
  To,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

/**
 * withRouter HOC provides router {@link RouteData}
 * Don't use navigate in render function of class or function component
 * **Note:** navigate will not work on SSR
 * @param Component Wrapped Component
 * @returns Component with extended props
 */
export function withRouter(Component: any) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const params = useParams();
    const ref = useRef();
    const navigateTo = (to: To, options?: NavigateOptions) => {
      const intervalId = setInterval(() => {
        if (ref.current) {
          clearInterval(intervalId);
          navigate(to, options);
        }
      });
    };
    return (
      <Component
        ref={ref}
        {...props}
        router={{ location, navigate: navigateTo, params, searchParams }}
      />
    );
  }

  return ComponentWithRouterProp;
}

export interface RouteData {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
  searchParams: ReturnType<typeof useSearchParams>;
}

export interface WithRouterProps {
  router: RouteData;
}
