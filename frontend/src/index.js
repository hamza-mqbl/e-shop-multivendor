import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./redux/store";

const root = createRoot(document.getElementById("root"));

root.render(

  // comment a line to see the change
  <Provider store={Store}>
    <App />
  </Provider>
);

reportWebVitals();
