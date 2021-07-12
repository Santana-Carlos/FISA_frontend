import React from "react";
import { HashRouter, Switch, Route, NavLink, Redirect } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import CrearVisitas from "../Seguimiento/CrearVisitas";
import ConsultarVisitas from "../Seguimiento/ConsultarVisitas";
import "./Cards.css";

const Seguimiento = () => {
  const token = useSelector((state) => state.token);
  const rol = useSelector((state) => state.rol);
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
            {rol !== "Comercial" && rol !== "Consulta" ? (
              <NavLink
                className="o-btnSidebar o-btnSidebar-seguimiento"
                activeClassName="o-btnSidebar o-btnSidebar-seguimientoActive"
                to="/crear_visitas"
              >
                <SideButton>Crear visitas</SideButton>
              </NavLink>
            ) : null}
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/consultar_visitas">
                <ConsultarVisitas token={token} rol={rol} />
              </Route>
              {rol !== "Comercial" && rol !== "Consulta" ? (
                <Route path="/crear_visitas">
                  <CrearVisitas token={token} />
                </Route>
              ) : null}
              <Redirect to="/consultar_visitas" />
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Seguimiento;
