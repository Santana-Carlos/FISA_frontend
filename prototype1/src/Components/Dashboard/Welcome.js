import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { BlueButton } from "../Buttons";
import "./Dashboard.css";

const Welcome = (props) => {
  const rol = props.rol;

  return (
    <div className="o-mainDashboard">
      <div className="o-mainDashboard-bigCard">
        <div
          style={{
            fontSize: "2.5rem",
            margin: "auto auto 1rem",
          }}
        >
          {"Bienvenido " + props.user}
        </div>
        <div
          style={{
            fontSize: "1.3rem",
            fontWeight: 200,
            margin: "0 auto 4rem",
          }}
        >
          {"Sesión iniciada como: " + rol}
        </div>
        {rol === "Consulta" ? null : (
          <Fragment>
            Accesos directos:
            <div className="o-accessButton-container">
              {rol !== "Comercial" ? (
                <React.Fragment>
                  <Link
                    to="dashboard/contacto#/crear_contacto"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="o-accessButton">
                      <BlueButton>Crear Contacto</BlueButton>
                    </div>
                  </Link>
                  <Link
                    to="dashboard/organizacion#/crear_organizacion"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="o-accessButton">
                      <BlueButton>Crear Organización</BlueButton>
                    </div>
                  </Link>
                </React.Fragment>
              ) : null}
              <Link
                to="dashboard/reportes#/reporte_contactos"
                style={{ textDecoration: "none" }}
              >
                <div className="o-accessButton">
                  <BlueButton>Reporte contactos</BlueButton>
                </div>
              </Link>
              {rol !== "Comercial" ? (
                <Link
                  to="dashboard/seguimiento#/crear_visitas"
                  style={{ textDecoration: "none" }}
                >
                  <div className="o-accessButton">
                    <BlueButton>Crear Visita</BlueButton>
                  </div>
                </Link>
              ) : (
                <Fragment>
                  <Link
                    to="dashboard/reportes#/reporte_organizaciones"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="o-accessButton">
                      <BlueButton>Reporte Orgs.</BlueButton>
                    </div>
                  </Link>
                  <Link
                    to="dashboard/reportes#/reporte_fechas"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="o-accessButton">
                      <BlueButton>Reporte por Fechas</BlueButton>
                    </div>
                  </Link>
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
        <Link
          exact={"true"}
          to="/3_14159265359/1_61803398874989"
          style={{
            display: "flex",
            margin: "auto auto auto 15rem",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "0.5em", color: "#f00" }}>{"."}</div>
        </Link>
        <div
          style={{
            margin: "auto 0 0.5rem",
          }}
        >
          {"FISA © 2022 v" + process.env.REACT_APP_VERSION}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
