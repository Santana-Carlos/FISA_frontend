import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import Para1OrganizacionVarios from "../Parametrizacion/Para1OrganizacionVarios";
import Para2OrganizacionActividad from "../Parametrizacion/Para2OrganizacionActividad";
import Para4ContactosOficina from "../Parametrizacion/Para4ContactosOficina";
import Para3InfoFinanciera from "../Parametrizacion/Para3InfoFinanciera";
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
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/informacion_financiera"
            >
              <SideButton>Información financiera</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/contacto_oficina"
            >
              <SideButton>Contacto y Oficina</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/ubicacion"
            >
              <SideButton>Ubicación</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-administracion"
              activeClassName="o-btnSidebar o-btnSidebar-administracionActive"
              to="/seguimiento"
            >
              <SideButton>Seguimiento</SideButton>
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
              <Route path="/informacion_financiera">
                <Para3InfoFinanciera token={token} />
              </Route>
              <Route path="/contacto_oficina">
                <Para4ContactosOficina token={token} />
              </Route>
              <Route path="/ubicacion">
                <h3>{"Ubicación"}</h3>
              </Route>
              <Route path="/seguimiento">
                <h3>{"Seguimiento"}</h3>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Administracion;
