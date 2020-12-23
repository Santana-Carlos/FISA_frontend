import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import ReporteOrganizacion from "../Reportes/ReporteOrganizacion";
import ReporteContacto from "../Reportes/ReporteContactos";
import ReporteFechas from "../Reportes/ReporteFechas";
import "./Cards.css";

const Reportes = () => {
  const token = useSelector((state) => state.token);
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
              <SideButton size="small">Reporte organizaciones</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-reportes"
              activeClassName="o-btnSidebar o-btnSidebar-reportesActive"
              to="/reporte_contactos"
            >
              <SideButton>Reporte contactos</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-reportes"
              activeClassName="o-btnSidebar o-btnSidebar-reportesActive"
              to="/reporte_fechas"
            >
              <SideButton>Reporte temporadas</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/reporte_organizaciones">
                <ReporteOrganizacion token={token} />
              </Route>
              <Route path="/reporte_contactos">
                <ReporteContacto token={token} />
              </Route>
              <Route path="/reporte_fechas">
                <ReporteFechas token={token} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Reportes;
