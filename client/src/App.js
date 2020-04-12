import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Layouts/Navbar";
import Landing from "./Components/Layouts/Landing";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import "./App.css";
import Alert from "./Components/Layouts/Alert";
//Redux

import { Provider } from "react-redux"; //............Provider integrates react and redux
import store from "./store"; //....includes redux store

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />

        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
