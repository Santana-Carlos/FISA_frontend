import React from "react";
import { HashRouter, Switch, Route, NavLink, Redirect } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import CrearContacto from "../Contactos/CrearContacto";
import ConsultarContacto from "../Contactos/ConsultarContacto";
import "./Cards.css";

const Contacto = () => {
  const token = useSelector((state) => state.token);
  const rol = useSelector((state) => state.rol);

  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-contacto">
            <NavLink
              className="o-btnSidebar o-btnSidebar-contacto"
              activeClassName="o-btnSidebar o-btnSidebar-contactoActive"
              to="/consultar_contacto"
            >
              <SideButton size="small">Consultar contactos</SideButton>
            </NavLink>
            {rol !== "Comercial" && rol !== "Consulta" ? (
              <NavLink
                className="o-btnSidebar o-btnSidebar-contacto"
                activeClassName="o-btnSidebar o-btnSidebar-contactoActive"
                to="/crear_contacto"
              >
                <SideButton>Crear contacto</SideButton>
              </NavLink>
            ) : null}
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/consultar_contacto">
                <ConsultarContacto token={token} rol={rol} />
              </Route>
              {rol !== "Comercial" && rol !== "Consulta" ? (
                <Route path="/crear_contacto">
                  <CrearContacto token={token} />
                </Route>
              ) : null}
              <Redirect to="/consultar_contacto" />
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Contacto;
