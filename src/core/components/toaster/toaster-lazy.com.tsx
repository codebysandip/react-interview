import { toast as toastFn, ToastContainer, ToastContainerProps } from "react-toastify";
import "./toaster.scss";

export default function LazyToaster(props: ToastContainerProps) {
  return (
    <div data-test-id="toast-container">
      <ToastContainer {...props} />
    </div>
  );
}

export const toast = toastFn;
