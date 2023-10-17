import { ToastContent, ToastOptions } from "react-toastify";

export type ToasterType = "success" | "error" | "warning" | "info";
export interface Toaster extends ToastOptions {
  type: ToasterType;
  message: ToastContent;
}
