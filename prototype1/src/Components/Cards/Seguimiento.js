import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import CrearVisitas from "../Seguimiento/CrearVisitas";
import "./Cards.css";

const Seguimiento = () => {
  const token = useSelector((state) => state.token);
  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-seguimiento">
            <NavLink
              className="o-btnSidebar o-btnSidebar-seguimiento"
              activeClassName="o-btnSidebar o-btnSidebar-seguimientoActive"
              to="/consultar_visitas"
            >
              <SideButton size="small">Consultar visitas</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-seguimiento"
              activeClassName="o-btnSidebar o-btnSidebar-seguimientoActive"
              to="/crear_visitas"
            >
              <SideButton>Crear visitas</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/consultar_visitas">
                <h5>Placeholder</h5>
              </Route>
              <Route path="/crear_visitas">
                <CrearVisitas token={token} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Seguimiento;
