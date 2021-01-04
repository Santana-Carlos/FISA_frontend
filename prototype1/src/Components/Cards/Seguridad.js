import React from "react";
import { HashRouter, Switch, Route, NavLink } from "react-router-dom";
import { SideButton } from "../Buttons";
//import { useSelector } from "react-redux";
import RegistroUsuario from "../Seguridad/RegistroUsuario";
import "./Cards.css";

const Seguridad = () => {
  //const token = useSelector((state) => state.token);
  //const rol = useSelector((state) => state.rol);
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
            <NavLink
              className="o-btnSidebar o-btnSidebar-seguridad"
              activeClassName="o-btnSidebar o-btnSidebar-seguridadActive"
              to="/configuracion_de_roles"
            >
              <SideButton>Configuración de roles</SideButton>
            </NavLink>
            <NavLink
              className="o-btnSidebar o-btnSidebar-seguridad"
              activeClassName="o-btnSidebar o-btnSidebar-seguridadActive"
              to="/registro_de_usuario"
            >
              <SideButton>Registro de usuario</SideButton>
            </NavLink>
          </div>
          <div className="o-cardPlaceholder">
            <Switch>
              <Route path="/cambio_contraseña">
                <h5>Cambio contraseña</h5>
              </Route>
              <Route path="/cambio_de_campos_obligatorios">
                <h5>Cambio campos obligatorios</h5>
              </Route>
              <Route path="/configuracion_de_menu">
                <h5>Configuración de menú</h5>
              </Route>
              <Route path="/configuracion_de_roles">
                <h5>Configuración de roles</h5>
              </Route>
              <Route path="/registro_de_usuario">
                <RegistroUsuario />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default Seguridad;
