import React, { Fragment, useEffect } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";

//Components
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layouts/Alert";

//store
import store from "./store/configureStore";

//action creator
import { loadUser } from "./actions/authAction";

//Custom funct
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  /*useEffect(() => {
    store.dispatch(loadUser());
  }, []);*/
  return (
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Alert />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </section>
    </Fragment>
  );
};

export default App;
