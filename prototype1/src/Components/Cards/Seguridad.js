import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
import { useSelector } from "react-redux";
import CambioContrasena from "../Seguridad/CambioContrasena";
import ControlUsuarios from "../Seguridad/ControlUsuarios";
import "./Cards.css";

const Seguridad = () => {
  const token = useSelector((state) => state.token);
  const rol = useSelector((state) => state.rol);
  const user = useSelector((state) => state.user);
  return (
    <HashRouter>
      <div className="o-cards">
        <div className="o-bigCard">
          <div className="o-sidebar o-sidebar-seguridad">
            <NavLink
              className="o-btnSidebar o-btnSidebar-seguridad"
              activeClassName="o-btnSidebar o-btnSidebar-seguridadActive"
              to="/cambio_contraseña"
              exact
            >
              <SideButton>Cambio de contraseña</SideButton>
            </NavLink>
            {rol === "Administrador" ? (
              <NavLink
                className="o-btnSidebar o-btnSidebar-seguridad"
                activeClassName="o-btnSidebar o-btnSidebar-seguridadActive"
                to="/control_de_usuarios"
              >
                <SideButton>Control de usuarios</SideButton>
              </NavLink>
            ) : null}
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/cambio_contraseña">
                <CambioContrasena token={token} />
              </Route>
              {rol === "Administrador" ? (
                <Route path="/control_de_usuarios">
                  <ControlUsuarios token={token} userName={user} />
                </Route>
              ) : null}
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Seguridad;
