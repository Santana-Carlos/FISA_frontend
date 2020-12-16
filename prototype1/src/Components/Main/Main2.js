import React from "react";
import Log from "./Log";
import Login from "./Login";
import "./Main.css";
import { Switch, Route } from "react-router-dom";

const Main = () => {
  return (
    <div className="o-main">
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/dashboard">
          <Log />
        </Route>
      </Switch>
    </div>
  );
};

export default Main;
