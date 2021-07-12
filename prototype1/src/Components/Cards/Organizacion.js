import React from "react";
import { HashRouter, Switch, Route, NavLink, Redirect } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import CrearOrganizacion from "../Organizacion/CrearOrganizacion";
import ConsultarOrganizacion from "../Organizacion/ConsultarOrganizacion";
import "./Cards.css";

const Organizacion = () => {
  const token = useSelector((state) => state.token);
  const rol = useSelector((state) => state.rol);
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
            {rol !== "Comercial" && rol !== "Consulta" ? (
              <NavLink
                className="o-btnSidebar o-btnSidebar-organizacion"
                activeClassName="o-btnSidebar o-btnSidebar-organizacionActive"
                to="/crear_organizacion"
              >
                <SideButton>Crear organización</SideButton>
              </NavLink>
            ) : null}
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/consultar_organizacion">
                <ConsultarOrganizacion token={token} rol={rol} />
              </Route>
              {rol !== "Comercial" && rol !== "Consulta" ? (
                <Route path="/crear_organizacion">
                  <CrearOrganizacion token={token} />
                </Route>
              ) : null}
              <Redirect to="/consultar_organizacion" />
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Organizacion;
