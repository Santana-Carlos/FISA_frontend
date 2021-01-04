import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import CrearOrganizacion from "../Organizacion/CrearOrganizacion";
import ConsultarOrganizacion from "../Organizacion/ConsultarOrganizacion";
import "./Cards.css";

const Organizacion = () => {
  const token = useSelector((state) => state.token);
  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-organizacion">
            <NavLink
              className="o-btnSidebar o-btnSidebar-organizacion"
              activeClassName="o-btnSidebar o-btnSidebar-organizacionActive"
              to="/consultar_organizacion"
            >
              <SideButton>Consultar organización</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-organizacion"
              activeClassName="o-btnSidebar o-btnSidebar-organizacionActive"
              to="/crear_organizacion"
            >
              <SideButton>Crear organización</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/consultar_organizacion">
                <ConsultarOrganizacion token={token} />
              </Route>
              <Route path="/crear_organizacion">
                <CrearOrganizacion token={token} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Organizacion;
