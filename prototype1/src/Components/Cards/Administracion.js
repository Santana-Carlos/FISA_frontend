import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import Para1OrganizacionVarios from "../Parametrizacion/Para1OrganizacionVarios";
import Para2OrganizacionActividad from "../Parametrizacion/Para2OrganizacionActividad";
import "./Cards.css";

const Administracion = () => {
  const token = useSelector((state) => state.token);
  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-administracion">
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/organizacion_varios"
            >
              <SideButton size="small">Organización (varios)</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/organizacion_actividad"
            >
              <SideButton>Organización (actividad)</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/organizacion_varios">
                <Para1OrganizacionVarios token={token} />
              </Route>
              <Route path="/organizacion_actividad">
                <Para2OrganizacionActividad token={token} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Administracion;
