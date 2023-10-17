import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Id, ToastContainerProps, ToastContent, ToastOptions } from "react-toastify";
import { useAppSelector } from "src/core/hook";

type ToastFn = (content: ToastContent, options?: ToastOptions) => Id;

export function Toaster(props: ToastContainerProps) {
  const [lazyToast, setLazyToast] = useState<{
    default: FunctionComponent<ToastContainerProps>;
  } | null>(null);

  const toastData = useAppSelector((state) => state.app.toast);
  const toast = useRef<ToastFn | null>(null);
  const showToast = () => {
    if (toastData && toast.current) {
      const { message, ...rest } = toastData;
      toast.current(message, rest);
    }
  };

  const loadToast = () => {
    if (!lazyToast) {
      import(/* webpackChunkName: "toaster" */ "./toaster-lazy.com").then((module) => {
        setLazyToast(module);
        toast.current = module.toast;
        showToast();
      });
    } else {
      showToast();
    }
  };

  useEffect(() => {
    loadToast();
  }, [toastData]);

  useEffect(() => {
    // load toast when browser is ideal so that toast will visible if internet connection is not available
    requestIdleCallback(
      () => {
        loadToast();
      },
      { timeout: 5000 },
    );
  }, []);

  if (lazyToast) {
    return <lazyToast.default {...props} />;
  }
  return null;
}
