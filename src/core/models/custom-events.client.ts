import { TOAST } from "src/const";
import { Toaster } from "./toaster.model";

export function ToastEvent(options: Toaster) {
  return new CustomEvent<Toaster>(TOAST, { detail: options });
}
