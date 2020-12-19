import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
//import { useSelector } from "react-redux";
import "./Cards.css";

const Reportes = () => {
  //const token = useSelector((state) => state.token);
  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-cardTitleCont">{"Generar reportes"}</div>
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-reportes">
            <NavLink
              className="o-btnSidebar o-btnSidebar-reportes"
              activeClassName="o-btnSidebar o-btnSidebar-reportesActive"
              to="/reporte_organizaciones"
            >
              <SideButton size="small">Organizaciones</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-reportes"
              activeClassName="o-btnSidebar o-btnSidebar-reportesActive"
              to="/reporte_contactos"
            >
              <SideButton>Contactos</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-reportes"
              activeClassName="o-btnSidebar o-btnSidebar-reportesActive"
              to="/reporte_contactos"
            >
              <SideButton>Fechas</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/reporte_organizaciones">
                <h5>Placeholder 1</h5>
              </Route>
              <Route path="/reporte_contactos">
                <h5>Placeholder 2</h5>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Reportes;
