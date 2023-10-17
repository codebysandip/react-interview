import { Provider } from "react-redux";
import { App } from "./app";

import { AppStore, createStore } from "./redux/create-store";
import "./style.scss";

export default function ReactCsrApp(props: ReactCsrAppProps) {
  const store = props.store || createStore();

  return <Provider store={store}>{props.appComp ? props.appComp : <App />}</Provider>;
}

interface ReactCsrAppProps {
  /** AppComp used here for cypress component testing */
  appComp?: React.ReactNode;

  /** Cypress will pass this store while component testing */
  store?: AppStore;
}
