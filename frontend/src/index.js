import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./redux/store";

const root = createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <Provider store={Store}>
      <App />
    </Provider>
  </HelmetProvider>
);

reportWebVitals();
