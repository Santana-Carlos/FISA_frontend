import React, { Component } from "react";
import { BlueButton } from "../Buttons";
import { Fade, CircularProgress } from "@material-ui/core";
import { Edit as IconEdit } from "@material-ui/icons";
import { Switch, Link, Route, Redirect } from "react-router-dom";
import Consultar1DatosBasicos from "./Consultar1DatosBasicos";
import Consultar2Oficinas from "./Consultar2Oficinas";
import Consultar3Contactos from "./Consultar3Contactos";
import Consultar4Finanzas from "./Consultar4Finanzas";
import Consultar5Files from "./Consultar5Files";
import "../Styles.css";

class OrganizacionMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      dbid_org: props.dbid_org,
      name_org: "",
      cat_org: "",
      razon_org: "",
      idtipo_org: "",
      idnum_org: "",
      pais_org: "",
      subsececo_org: "",
      estado_org: "",
      loading: true,
    };
  }

  componentDidMount() {
    this.callApi();
  }

  callApi = () => {
    const data = {
      org_id: this.props.dbid_org,
    };
    if (this.props.dbid_org === "") {
      return null;
    }
    fetch(process.env.REACT_APP_API_URL + "Organizacion/EditOrg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          this.setState({
            name_org: data.organizacion.nombre,
            cat_org: data.organizacion.categoria,
            razon_org: data.organizacion.razon_social,
            idtipo_org: data.organizacion.tipo_documento_organizacion,
            idnum_org: data.organizacion.numero_documento,
            pais_org: data.organizacion.pais,
            subsececo_org: data.organizacion.subsector,
            estado_org: data.organizacion.estado,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <Switch>
        {this.props.dbid_org === "" ? (
          <Redirect exact={"true"} to="/consultar_organizacion" />
        ) : null}
        <Route exact path="/consultar_organizacion/editar">
          <div className="o-cardContent">
            <div className="o-contentTittle">
              <h3
                className="o-contentTittle-principal"
                style={{ marginTop: "0.2rem" }}
              >
                {"Editar Organización"}
              </h3>
              <div className="o-text-nameOrg">
                <Fade
                  in={this.state.loading}
                  style={{
                    transitionDelay: "200ms",
                    marginRight: "1rem",
                  }}
                  unmountOnExit
                >
                  <div style={{ fontSize: "1rem" }}>
                    {"Cargando... "}
                    <CircularProgress size={"1rem"} thickness={6} />
                  </div>
                </Fade>
              </div>
            </div>
            <div className="o-contentForm-big-consultas">
              <div className="o-consultas-containerMenu">
                <div className="o-consultasMenu">
                  <div className="o-textMain">
                    {"Nombre comercial:"}
                    <div className="o-textSub">
                      {this.state.name_org || "Sin asignar"}
                    </div>
                  </div>
                  <div className="o-textMain">
                    {"Razón social:"}
                    <div className="o-textSub">
                      {this.state.razon_org || "Sin asignar"}
                    </div>
                  </div>
                </div>
                <div className="o-consultasMenu">
                  <div className="o-textMain">
                    {"Identificación:"}
                    <div className="o-textSub">
                      {this.state.idtipo_org + " " + this.state.idnum_org ||
                        "Sin asignar"}
                    </div>
                  </div>
                  <div className="o-textMain">
                    {"Subsector económico:"}
                    <div className="o-textSub">
                      {this.state.subsececo_org || "Sin asignar"}
                    </div>
                  </div>
                </div>
                <div className="o-consultasMenu">
                  <div className="o-textMain">
                    {"Categoría:"}
                    <div className="o-textSub">
                      {this.state.cat_org || "Sin asignar"}
                    </div>
                  </div>
                  <div className="o-textMain">
                    {"País:"}
                    <div className="o-textSub">
                      {this.state.pais_org || "Sin asignar"}
                    </div>
                  </div>
                </div>
                <div
                  className="o-consultasMenu"
                  style={{ marginRight: "6rem" }}
                >
                  <div className="o-textMain">
                    {"Estado:"}
                    <div className="o-textSub">
                      {(this.state.estado_org ? "ACTIVO" : "INACTIVO") ||
                        "Sin asignar"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="o-btnMenu-container">
                <Link to="editar/datos_basicos" className="o-btnEditMenu">
                  <BlueButton>
                    {"Datos básicos"}
                    <IconEdit style={{ marginLeft: "0.7rem" }} size="small" />
                  </BlueButton>
                </Link>
                <Link to="editar/oficinas" className="o-btnEditMenu">
                  <BlueButton>
                    {"Oficinas"}
                    <IconEdit style={{ marginLeft: "0.7rem" }} size="small" />
                  </BlueButton>
                </Link>
                <Link to="editar/contactos" className="o-btnEditMenu">
                  <BlueButton>
                    {"Contactos"}
                    <IconEdit style={{ marginLeft: "0.7rem" }} size="small" />
                  </BlueButton>
                </Link>
                <Link to="editar/finanzas" className="o-btnEditMenu">
                  <BlueButton>
                    {"Info. financiera"}
                    <IconEdit style={{ marginLeft: "0.7rem" }} size="small" />
                  </BlueButton>
                </Link>
                <Link to="editar/archivos" className="o-btnEditMenu">
                  <BlueButton>
                    {"Documentos"}
                    <IconEdit style={{ marginLeft: "0.7rem" }} size="small" />
                  </BlueButton>
                </Link>
              </div>
            </div>
            <div className="o-btnBotNav">
              <div style={{ color: "#FFFFFF" }}>{"Me encontraste!"}</div>
              <Link
                exact={"true"}
                to="/consultar_organizacion"
                className="o-btnBotNav-btn"
              >
                <BlueButton>Volver</BlueButton>
              </Link>
            </div>
          </div>
        </Route>
        <Route path="/consultar_organizacion/editar/datos_basicos">
          <Consultar1DatosBasicos
            token={this.props.token}
            dbid_org={this.props.dbid_org}
            name_org={this.state.name_org}
            box_spacing={this.props.box_spacing}
            rol={this.props.rol}
          />
        </Route>
        <Route path="/consultar_organizacion/editar/oficinas">
          <Consultar2Oficinas
            token={this.props.token}
            dbid_org={this.props.dbid_org}
            name_org={this.state.name_org}
            box_spacing={this.props.box_spacing}
            box_size_table={this.props.box_size_table}
            rol={this.props.rol}
          />
        </Route>
        <Route path="/consultar_organizacion/editar/contactos">
          <Consultar3Contactos
            token={this.props.token}
            dbid_org={this.props.dbid_org}
            name_org={this.state.name_org}
            box_spacing={this.props.box_spacing}
            box_size_table={this.props.box_size_table}
            rol={this.props.rol}
          />
        </Route>
        <Route path="/consultar_organizacion/editar/finanzas">
          <Consultar4Finanzas
            token={this.props.token}
            dbid_org={this.props.dbid_org}
            name_org={this.state.name_org}
            box_spacing={this.props.box_spacing}
            subtitle_spacing={this.props.subtitle_spacing}
            rol={this.props.rol}
          />
        </Route>
        <Route path="/consultar_organizacion/editar/archivos">
          <Consultar5Files
            token={this.props.token}
            dbid_org={this.props.dbid_org}
            name_org={this.state.name_org}
            box_size={this.props.box_size}
            rol={this.props.rol}
          />
        </Route>
      </Switch>
    );
  }
}

export default OrganizacionMenu;
