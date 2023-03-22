import React from "react";
import Log from "./Log";
import Login from "./Login";
import "./Main.css";
import { Switch, Route, Redirect } from "react-router-dom";

const Main = () => {
  return (
    <div className="o-main">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/dashboard">
          <Log />
        </Route>
        <Route exact path="/3_14159265359/1_61803398874989">
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <iframe
              title="Rickroll"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1&loop=1&background=0&disablekb=1"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
            />
          </div>
        </Route>
        <Redirect to="/login" />
      </Switch>
    </div>
  );
};

export default Main;
