import spinner from "assets/images/Spinner-1s-200px.svg";
import { Helmet } from "react-helmet";

/** Use this component to set common head tags like meta, link and title */
export function CsrHead() {
  const serviceWorker = `
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js", { type: "module" })
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }`;

  return (
    <Helmet>
      <title>React App</title>
      {process.env.ENV === "production" && <script>{`${serviceWorker}`}</script>}
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#f8f9fa" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=5"
      />
      <link href={spinner} rel="preload" as="image" />
      <link rel="apple-touch-icon" href="/assets/icons/ios/192.png" />
    </Helmet>
  );
}
