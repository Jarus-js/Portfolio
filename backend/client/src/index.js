import React from "react";
import ReactDOM from "react-dom";
import history from "./history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configureStore";

import App from "./App";

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);
