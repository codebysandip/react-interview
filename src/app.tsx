import { Container } from "@mui/material";
import { Header } from "core/components/header/header";
import { useEffect, useState } from "react";
import { Navigate, matchPath, useLocation } from "react-router";
import { Route, Routes } from "react-router-dom";
import { CsrHead } from "src/core/components/csr-head/csr-head.comp";
import { NO_HEADER_PATHS, ROUTE_404 } from "./const";
import LazyRoute from "./core/components/lazy-route/lazy-route.component";
import { Toaster } from "./core/components/toaster/toaster.comp";
import { Routes as PageRoutes } from "./routes";

export function App(props: AppProps) {
  const location = useLocation();

  const checkHeader = () => {
    let isHeaderVisible = true;
    for (const path of NO_HEADER_PATHS) {
      if (matchPath(path, location.pathname)) {
        isHeaderVisible = false;
        break;
      }
    }
    return isHeaderVisible;
  };
  const [showHeader, setShowHeader] = useState(checkHeader());

  useEffect(() => {
    const isHeaderVisible = checkHeader();
    if (isHeaderVisible !== showHeader) {
      setShowHeader(isHeaderVisible);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Use SsrHead component to set common Head tags */}
      <CsrHead />
      {/* Header and footer should not visible on error page if header/footer is dynamic.
      Why? because may be error page coming because of Header/Footer api */}
      {showHeader && <Header />}
      <Container className="my-4">
        <Routes>
          {PageRoutes.map((r, idx) => {
            if (r.children) {
              return (
                <Route
                  path={r.path}
                  element={<LazyRoute moduleProvider={r.component} route={r} {...props} />}
                  key={idx}
                >
                  {r.children.map((child) => {
                    return (
                      <Route
                        path={child.path}
                        element={
                          <LazyRoute moduleProvider={child.component} route={child} {...props} />
                        }
                        key={idx}
                      />
                    );
                  })}
                </Route>
              );
            }
            return (
              <Route
                path={r.path}
                element={<LazyRoute moduleProvider={r.component} route={r} {...props} />}
                key={idx}
              />
            );
          })}
          <Route path="*" element={<Navigate to={ROUTE_404} />} />
        </Routes>
      </Container>
      <Toaster />
    </>
  );
}

export interface AppProps {
  pageProps?: any;
}
