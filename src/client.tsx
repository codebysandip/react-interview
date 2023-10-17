import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ReactCsrApp from "./index";

const container = document.getElementById("root");
/* istanbul ignore if  */
if (!container) {
  throw new Error("root element not available!!");
}

const createBrowserRouter = () => {
  // Don't change anything here
  // Add your code in src/index.tsx
  return (
    <BrowserRouter>
      <ReactCsrApp />
    </BrowserRouter>
  );
};

const root = createRoot(container);
root.render(createBrowserRouter());
