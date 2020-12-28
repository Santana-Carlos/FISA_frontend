import React from "react";
import { Route, NavLink, Redirect } from "react-router-dom";
import { Button } from "@material-ui/core/";
import { ExitToApp as IconExit } from "@material-ui/icons";
import logo from "../../Assets/FisaLogo.png";
import Organizacion from "../Cards/Organizacion";
import Contacto from "../Cards/Contacto";
import Seguimiento from "../Cards/Seguimiento";
import Reportes from "../Cards/Reportes";
import Administracion from "../Cards/Administracion";
import Seguridad from "../Cards/Seguridad";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  logOut,
  logoutToken,
  updateUser,
  updatePass,
  updateRol,
} from "../../Actions";
import SwitchWithSlide from "../SwitchWithSlide/SwitchWithSlide";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const rol = useSelector((state) => state.rol);
  const token = useSelector((state) => state.token);
  const isLog = useSelector((state) => state.isLog);

  const callApiLogout = () => {
    window.clearInterval(window.refreshToken);
    fetch(process.env.REACT_APP_API_URL + "logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).catch((error) => {
      console.error("Error:", error);
    });
    dispatch(logoutToken(""));
    dispatch(updateUser(""));
    dispatch(updatePass(""));
    dispatch(updateRol(""));
    dispatch(logOut());
  };

  return (
    <div className="o-dashboard">
      {isLog ? null : <Redirect exact to="/" />}
      <div className="o-bannerDash">
        <div className="o-bannerDash-btnContainer">
          <NavLink className="o-btnBannerLogo" to="/dashboard">
            <Button className="o-btnBanner-btn">
              <img className="o-logoDash" src={logo} alt="Home" />
            </Button>
          </NavLink>
          <NavLink
            className="o-btnBanner"
            activeClassName="o-btnBannerActive o-btnOrganizacion-active"
            to="/dashboard/organizacion#/consultar_organizacion"
          >
            <Button className="o-btnBanner-btn">Organizaciones</Button>
          </NavLink>
          <NavLink
            className="o-btnBanner"
            activeClassName="o-btnBannerActive o-btnContacto-active"
            to="/dashboard/contacto#/consultar_contacto"
          >
            <Button className="o-btnBanner-btn">Contactos</Button>
          </NavLink>
          <NavLink
            className="o-btnBanner"
            activeClassName="o-btnBannerActive o-btnSeguimiento-active"
            to="/dashboard/seguimiento#/placeholder_1"
          >
            <Button className="o-btnBanner-btn">Seguimiento</Button>
          </NavLink>
          <NavLink
            className="o-btnBanner"
            activeClassName="o-btnBannerActive o-btnReportes-active"
            to="/dashboard/reportes#/reporte_organizaciones"
          >
            <Button className="o-btnBanner-btn">Reportes</Button>
          </NavLink>
          <NavLink
            className="o-btnBanner"
            activeClassName="o-btnBannerActive o-btnAdministracion-active"
            to="/dashboard/administracion#/placeholder_1"
          >
            <Button className="o-btnBanner-btn">Administración</Button>
          </NavLink>
          <NavLink
            className="o-btnBanner"
            activeClassName="o-btnBannerActive o-btnSeguridad-active"
            to="/dashboard/seguridad#/cambio_contraseña"
          >
            <Button className="o-btnBanner-btn">Seguridad</Button>
          </NavLink>
        </div>
        <NavLink exact={true} to="/" className="o-btnBannerLogout">
          <Button
            className="o-btnBanner-btn"
            onClick={callApiLogout}
            style={{ paddingRight: "0.25rem" }}
          >
            Salir
            <IconExit
              style={{ marginLeft: "0.4rem", marginRight: 0 }}
              size="small"
            />
          </Button>
        </NavLink>
      </div>
      <SwitchWithSlide>
        <Route exact path="/dashboard/">
          <div className="o-mainDashboard">
            <h1>{"Bienvenido " + user}</h1>
            <h3>{"(Sesión iniciada como " + rol + ")"}</h3>

            <div
              style={{
                margin: "auto 0 0.5rem",
              }}
            >
              {"FISA © 2020 v" + process.env.REACT_APP_VERSION}
            </div>
          </div>
        </Route>
        <Route path="/dashboard/organizacion">
          <Organizacion />
        </Route>
        <Route path="/dashboard/contacto">
          <Contacto />
        </Route>
        <Route path="/dashboard/seguimiento">
          <Seguimiento />
        </Route>
        <Route path="/dashboard/reportes">
          <Reportes />
        </Route>
        <Route path="/dashboard/administracion">
          <Administracion />
        </Route>
        <Route path="/dashboard/seguridad">
          <Seguridad />
        </Route>
      </SwitchWithSlide>
    </div>
  );
};

export default Dashboard;
