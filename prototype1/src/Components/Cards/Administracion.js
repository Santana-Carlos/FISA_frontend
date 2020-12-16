import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
//import { useSelector } from "react-redux";
import "./Cards.css";

const Administracion = () => {
  //const token = useSelector((state) => state.token);
  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-cardTitleCont">{"Administrar parámetros"}</div>
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-administracion">
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/placeholder_1"
            >
              <SideButton size="small">Placeholder 1</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/placeholder_2"
            >
              <SideButton>Placeholder 2</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/placeholder_1">
                <h5>Placeholder 1</h5>
              </Route>
              <Route path="/placeholder_2">
                <h5>Placeholder 2</h5>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Administracion;
