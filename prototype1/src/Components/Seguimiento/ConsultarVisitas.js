import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
} from "../Buttons";
import { Delete as IconDelete, ZoomIn as IconSelect } from "@material-ui/icons";
import { Switch, Route } from "react-router-dom";
import CrearTareas from "./CrearTareas";
import "../Styles.css";

const items = [
  {
    id: "organizacion",
    nombre: "Organización",
  },
  {
    id: "titulo",
    nombre: "Motivo",
  },
];

class ConsultarVisitas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      createS: false,
      reqText: false,
      visitas: [],
      temp_name_org: "",
      temp_id_org: "",
      temp_id_con: "",
      temp_idFake_con: null,
      temp_id_ofi: "",
      temp_id_vis: "",
      visita_data: {},
      temp_fecpro_vis: "",
      temp_feceje_vis: "",
      temp_titulo_vis: "",
      temp_obs_vis: "",
      temp_res_vis: "",
      temp_userasig_vis: "",
      temp_estado_vis: "",
      temp_userUdate_vis: "",
      temp_dateUdate_vis: "",
      users_api: [],
      contacto_org_api: [],
      oficina_org_api: [],
      estado_vis_api: [],
      estado_tar_api: [],
      search_tipo: "",
      search_pal: "",
      addVisit: false,
      delVisit: false,
      loading: true,
      loadingDiag: false,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "40rem" : "24rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "40rem" : "24rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
    });
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "Visita/Data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          users_api: data.usuarios,
          estado_vis_api: data.estadoVisitas,
          estado_tar_api: data.estadoTareas,
        });
      })
      .catch((error) => {});
    this.callAPi();
    this.setState({
      winInterval: window.setInterval(this.resizeBox, 1000),
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.winInterval);
  }

  callAPi = () => {
    fetch(process.env.REACT_APP_API_URL + "Visita", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          this.setState({
            visitas: data.visitas,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
      });
  };

  apiSearch = () => {
    const data = {
      tipo: this.state.search_tipo,
      palabra: this.state.search_pal,
    };
    //console.log(data);
    if (this.state.search_tipo !== "" || this.state.search_pal !== "") {
      fetch(process.env.REACT_APP_API_URL + "Visita/Search", {
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
              loading: false,
              visitas: data.visitas,
              reqText: false,
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({ loading: false, reqText: true, createS: true });
      this.callAPi();
    }
  };

  apiToday = () => {
    this.setState({ loading: true });
    fetch(process.env.REACT_APP_API_URL + "Visita/Today", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          this.setState({
            loading: false,
            visitas: data.visitas,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleClickOpenDel = () => {
    this.setState({ delVisit: true });
  };

  handleCloseDel = (a) => {
    const idVis = this.state.temp_id_vis;
    if (a) {
      this.setState({ loading: true });
      fetch(process.env.REACT_APP_API_URL + "Visita/" + idVis, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            this.setState({
              delVisit: false,
              temp_id_vis: "",
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({
        delVisit: false,
        temp_id_org: "",
      });
    }
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  editVisita = () => {
    window.location.assign("/dashboard/seguimiento#/consultar_visitas/tareas");
  };

  clearFunc = () => {
    this.setState(
      {
        loading: true,
        search_pal: "",
        search_tipo: "",
        reqText: false,
      },
      this.callAPi()
    );
  };

  selVisita = () => {
    const idVis = this.state.temp_id_vis;
    fetch(process.env.REACT_APP_API_URL + "Visita/" + idVis, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        if (data.success) {
          this.setState(
            {
              temp_id_org: data.visita.organizacion_id,
              temp_id_con: data.visita.contacto_id,
              temp_id_ofi: data.visita.oficina_id,
              temp_fecpro_vis: data.visita.fecha_programada,
              temp_feceje_vis: data.visita.fecha_ejecucion,
              temp_titulo_vis: data.visita.titulo,
              temp_obs_vis: data.visita.observaciones,
              temp_res_vis: data.visita.resultado,
              temp_userasig_vis: data.visita.usuario_asignado,
              temp_estado_vis: data.visita.estado_id,
              temp_dateUdate_vis: data.visita.updated_at,
              temp_userUdate_vis:
                data.usuario_actualizacion.usuario_actualizacion,
              visita_data: {
                fecha_programada: data.visita.fecha_programada,
                titulo: data.visita.titulo,
              },
              loading: false,
            },
            this.callApiOrg
          );
        }
      })
      .catch((error) => {
        this.setState({ loadingDiag: false });
      });
  };

  callApiOrg = () => {
    const data = {
      organizacion_id: this.state.temp_id_org,
    };
    // console.log(data);
    fetch(process.env.REACT_APP_API_URL + "Visita/OrgData", {
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
        this.setState(
          {
            contacto_org_api: data.contactos,
            oficina_org_api: data.oficinas,
          },
          this.dataFake
        );
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  dataFake = () => {
    const tempCon = this.state.contacto_org_api;
    const tempConFake = tempCon.filter(
      (obj) => obj.id === this.state.temp_id_con
    );

    this.setState({
      temp_idFake_con: tempConFake[0],
    });
  };

  handleClose = (a) => {
    if (a) {
      this.callApiPutVisita();
    } else {
      this.setState({ addVisit: false, reqText: false });
    }
  };

  callApiPutVisita = () => {
    this.setState({
      loadingDiag: true,
    });
    const idVis = this.state.temp_id_vis;
    const data = {
      organizacion_id: this.state.temp_id_org,
      contacto_id: this.state.temp_id_con,
      oficina_id: this.state.temp_id_ofi,
      fecha_programada: this.state.temp_fecpro_vis,
      fecha_ejecucion: this.state.temp_feceje_vis,
      titulo: this.state.temp_titulo_vis,
      observaciones: this.state.temp_obs_vis,
      resultado: this.state.temp_res_vis,
      usuario_asignado: this.state.temp_userasig_vis,
      estado_id: this.state.temp_estado_vis,
    };

    fetch(process.env.REACT_APP_API_URL + "Visita/" + idVis, {
      method: "PUT",
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
            temp_id_vis: data.visita.id,
            loadingDiag: false,
            addVisit: false,
            reqText: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          loadingDiag: false,
          reqText: true,
          createS: true,
        });
      });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_search_pal":
        this.setState({ search_pal: value });
        break;
      case "input_search_tipo":
        this.setState({ search_tipo: value });
        break;
      case "input_titulo_vis":
        this.setState({ temp_titulo_vis: value });
        break;
      case "input_obs_vis":
        this.setState({ temp_obs_vis: value });
        break;
      case "input_id_ofi":
        this.setState({ temp_id_ofi: value });
        break;
      case "input_estado_vis":
        this.setState({ temp_estado_vis: value });
        break;
      case "input_userasig_vis":
        this.setState({ temp_userasig_vis: value });
        break;
      default:
        break;
    }
  }

  handleChangeCon(event, value) {
    if (value === null) {
      this.setState({
        temp_idFake_con: value,
        temp_id_con: "",
        temp_id_ofi: "",
      });
    } else {
      this.setState({
        temp_idFake_con: value,
        temp_id_con: value.id,
        temp_id_ofi: value.oficina_id === null ? "" : value.oficina_id,
      });
    }
  }

  handleDatePro = (date) => {
    if (date !== null && date !== "") {
      this.setState({ temp_fecpro_vis: date });
    } else {
      this.setState({ temp_fecpro_vis: "" });
    }
  };

  handleDateEje = (date) => {
    if (date !== null && date !== "") {
      this.setState({ temp_feceje_vis: date });
    } else {
      this.setState({ temp_feceje_vis: "" });
    }
  };

  render() {
    let BOX_SPACING = this.state.box_spacing;
    let BOX_SIZE = this.state.box_size;
    return (
      <Switch>
        <Route exact path="/consultar_visitas">
          <div className="o-cardContent">
            <div className="o-contentTittle">
              <h3
                className="o-contentTittle-principal"
                style={{ marginTop: "0.2rem" }}
              >
                Consultar visitas
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
              <div className="o-consultas-containerInit">
                <FormControl
                  className="o-consultas"
                  style={{ margin: "0.8rem 1rem 0 0" }}
                  variant="outlined"
                  margin="dense"
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Filtrar por
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.search_tipo || ""}
                    onChange={this.handleChange}
                    label="Filtrar por"
                    name="input_search_tipo"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_search_tipo"
                    ></MenuItem>
                    {items.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <div className="o-consultas">
                  <TextField
                    label="Palabra"
                    variant="outlined"
                    name="input_search_pal"
                    value={this.state.search_pal || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div className="o-consultas-btn">
                  <div className="o-btnConsultas">
                    <BlueButton onClick={this.apiSearch}>Filtrar</BlueButton>
                  </div>
                  <div className="o-btnConsultas">
                    <RedButton onClick={this.clearFunc}>Limpiar</RedButton>
                  </div>
                  <div className="o-btnConsultas" style={{ width: "4rem" }}>
                    <BlueButton onClick={this.apiToday}>Hoy</BlueButton>
                  </div>
                </div>
              </div>
              <div className="o-contentForm-big-consultasHalf">
                <TableContainer
                  className="o-tableBase-consultas"
                  style={{ maxHeight: BOX_SIZE, marginBottom: "auto" }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Organización</StyledTableCell>
                        <StyledTableCell>Fecha visita</StyledTableCell>
                        <StyledTableCell>Motivo</StyledTableCell>
                        <StyledTableCell>Estado</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.visitas.map((obj, i) => (
                        <TableRow
                          key={i}
                          hover={true}
                          selected={obj.id === this.state.temp_id_vis}
                        >
                          <StyledTableCell size="small">
                            {obj.organizacion}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.fecha_programada}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.titulo}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.nombre}
                          </StyledTableCell>
                          <StyledTableCell
                            size="small"
                            style={{ paddingRight: "0.1rem" }}
                          >
                            <IconButton
                              size="small"
                              className="o-tinyBtn"
                              color="primary"
                              onClick={() =>
                                this.setState(
                                  {
                                    temp_id_vis: obj.id,
                                    temp_name_org: obj.organizacion,
                                    loading: true,
                                  },
                                  this.selVisita
                                )
                              }
                            >
                              <IconSelect />
                            </IconButton>
                          </StyledTableCell>
                          <StyledTableCell
                            size="small"
                            style={{ paddingLeft: "0.1rem" }}
                          >
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() =>
                                this.setState(
                                  { temp_id_vis: obj.id },
                                  this.handleClickOpenDel
                                )
                              }
                            >
                              <IconDelete />
                            </IconButton>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                      {this.state.visitas[0] === undefined ? (
                        <TableRow>
                          <StyledTableCell>...</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div
                className="o-card-VisitaView"
                style={{ maxHeight: BOX_SIZE, marginBottom: "auto" }}
              >
                {this.state.temp_titulo_vis === "" ? (
                  <div style={{ margin: "3rem auto", color: "gray" }}>
                    {"Selecciona una visita"}
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <div
                      className="o-textMain2"
                      style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}
                    >
                      {this.state.temp_titulo_vis}
                    </div>
                    <div
                      className="o-textMain2"
                      style={{
                        marginBottom: "1.2rem",
                        maxHeight: "2.3rem",
                        overflowY: "scroll",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {this.state.temp_obs_vis === null
                        ? "Sin observaciones"
                        : this.state.temp_obs_vis}
                    </div>

                    <div
                      className="o-textMain2"
                      style={{
                        maxHeight: "2.3rem",
                        overflowY: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <div>
                        <div className="o-textSub2">{"Organización: "}</div>
                        {this.state.temp_name_org}
                      </div>
                    </div>

                    <div className="o-textMain2">
                      <div>
                        <div className="o-textSub2">
                          {"Fecha programada/realizada:"}
                        </div>
                        {this.state.temp_fecpro_vis + " / "}
                        {this.state.temp_feceje_vis === null
                          ? "Sin realizar"
                          : this.state.temp_feceje_vis + ""}
                      </div>
                    </div>

                    <div className="o-textMain2">
                      <div>
                        <div className="o-textSub2">{"Usuario asignado:"}</div>
                        {
                          this.state.users_api[
                            this.state.users_api.findIndex(
                              (x) => x.id === this.state.temp_userasig_vis
                            )
                          ].usuario
                        }
                      </div>

                      <div
                        style={{ marginLeft: "0.5rem", paddingLeft: "1rem" }}
                      >
                        <div className="o-textSub2">{"Estado:"}</div>
                        {
                          this.state.estado_vis_api[
                            this.state.estado_vis_api.findIndex(
                              (x) => x.id === this.state.temp_estado_vis
                            )
                          ].nombre
                        }
                      </div>
                    </div>

                    <div className="o-textMain2">
                      <div>
                        <div className="o-textSub2">
                          {"última actualización:"}
                        </div>
                        {this.state.temp_userUdate_vis +
                          " - " +
                          this.state.temp_dateUdate_vis}
                      </div>
                    </div>

                    <div className="o-btnBotNavDoble2">
                      <div
                        className="o-btnBotNav-btn"
                        style={{ width: "6rem" }}
                      >
                        <GreenButton
                          onClick={() => {
                            this.setState({ addVisit: true });
                          }}
                        >
                          {"Editar"}
                        </GreenButton>
                      </div>
                      <div
                        className="o-btnBotNav-btn"
                        style={{ width: "6rem" }}
                      >
                        <BlueButton
                          onClick={() => {
                            window.location.assign(
                              "/dashboard/seguimiento#/consultar_visitas/tareas"
                            );
                          }}
                        >
                          {"Tareas"}
                        </BlueButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={this.state.addVisit}
              onClose={() => this.handleClose(false)}
              maxWidth={false}
            >
              <DialogTitle>
                <div className="o-row">
                  Añadir visita
                  <h5 className="o-diagTittle-sub">
                    campos marcados con * son obligatorios
                  </h5>
                  <div className="o-text-nameOrg">
                    <Fade
                      in={this.state.loadingDiag}
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
              </DialogTitle>
              <div className="o-diagContent"></div>
              <DialogContent>
                <div className="o-contentForm-big">
                  <div className="o-contentFormDiag">
                    <h3 className="o-diagSubTittle">Descripción</h3>
                    <div style={{ marginBottom: BOX_SPACING }}>
                      <TextField
                        label={
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            {"Título"}
                            <div
                              style={{ color: "#FF0000", marginLeft: "0.1rem" }}
                            >
                              {"*"}
                            </div>
                          </div>
                        }
                        variant="outlined"
                        name="input_titulo_vis"
                        value={this.state.temp_titulo_vis || ""}
                        onChange={this.handleChange}
                        className="o-space"
                        margin="dense"
                        error={
                          this.state.reqText &&
                          this.state.temp_titulo_vis === ""
                        }
                      />
                    </div>
                    <div style={{ marginBottom: BOX_SPACING }}>
                      <TextField
                        id="outlined-textarea"
                        label="Observaciones"
                        value={this.state.temp_obs_vis || ""}
                        multiline
                        rows={3}
                        variant="outlined"
                        name="input_obs_vis"
                        onChange={this.handleChange}
                        className="o-space"
                        margin="dense"
                      />
                    </div>

                    <div style={{ marginBottom: BOX_SPACING }}>
                      <Autocomplete
                        value={this.state.temp_idFake_con || null}
                        onChange={this.handleChangeCon}
                        options={this.state.contacto_org_api || []}
                        noOptionsText={null}
                        getOptionLabel={(option) =>
                          option.nombres +
                          option.apellidos +
                          " - Cel. " +
                          option.celular +
                          "Tel." +
                          option.telefono +
                          "Ext. " +
                          option.extension
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                {"Contacto"}
                                <div
                                  style={{
                                    color: "#FF0000",
                                    marginLeft: "0.1rem",
                                  }}
                                >
                                  {"*"}
                                </div>
                              </div>
                            }
                            margin="dense"
                            className="o-space"
                            variant="outlined"
                            error={
                              this.state.reqText &&
                              this.state.temp_idFake_con === null
                            }
                          />
                        )}
                      />
                    </div>

                    <FormControl
                      variant="outlined"
                      margin="dense"
                      error={
                        this.state.reqText && this.state.temp_estado_vis === ""
                      }
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Oficina
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.temp_id_ofi}
                        onChange={this.handleChange}
                        label="Oficina"
                        name="input_estado_vis"
                        className="o-space"
                        style={{ marginBottom: 0 }}
                      >
                        <MenuItem
                          disabled={true}
                          value="input_id_ofi"
                        ></MenuItem>
                        {this.state.oficina_org_api.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.direccion} {obj.ciudad} - {obj.pais}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="o-contentFormDiag">
                    <h3 className="o-diagSubTittle">Desarrollo</h3>
                    <div style={{ marginBottom: BOX_SPACING }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                          inputVariant="outlined"
                          variant="inline"
                          format="dd/MM/yyyy - hh:mm a"
                          margin="dense"
                          label={
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              {"Fecha programada"}
                              <div
                                style={{
                                  color: "#FF0000",
                                  marginLeft: "0.1rem",
                                }}
                              >
                                {"*"}
                              </div>
                            </div>
                          }
                          value={this.state.temp_fecpro_vis || null}
                          onChange={this.handleDatePro}
                          className="o-space"
                          invalidDateMessage={"Fecha inválida"}
                          autoOk={true}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          error={
                            this.state.reqText &&
                            this.state.temp_fecpro_vis === ""
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div style={{ marginBottom: BOX_SPACING }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                          inputVariant="outlined"
                          variant="inline"
                          format="dd/MM/yyyy - hh:mm a"
                          margin="dense"
                          label="Fecha ejecución"
                          value={this.state.temp_feceje_vis || null}
                          onChange={this.handleDateEje}
                          className="o-space"
                          invalidDateMessage={"Fecha inválida"}
                          autoOk={true}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      error={
                        this.state.reqText &&
                        this.state.temp_userasig_vis === ""
                      }
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          {"Usuario asignado"}
                          <div
                            style={{ color: "#FF0000", marginLeft: "0.1rem" }}
                          >
                            {"*"}
                          </div>
                        </div>
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.temp_userasig_vis || ""}
                        onChange={this.handleChange}
                        label="Usuario asignado*"
                        name="input_userasig_vis"
                        className="o-space"
                        style={{ marginBottom: BOX_SPACING }}
                      >
                        <MenuItem
                          disabled={true}
                          value="input_userasig_vis"
                        ></MenuItem>
                        {this.state.users_api.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.usuario}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      style={{ marginTop: "auto" }}
                      error={
                        this.state.reqText && this.state.temp_estado_vis === ""
                      }
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          {"Estado"}
                          <div
                            style={{ color: "#FF0000", marginLeft: "0.1rem" }}
                          >
                            {"*"}
                          </div>
                        </div>
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.temp_estado_vis || ""}
                        onChange={this.handleChange}
                        label="Estado*"
                        name="input_estado_vis"
                        className="o-space"
                        style={{ marginBottom: 0 }}
                      >
                        <MenuItem
                          disabled={true}
                          value="input_estado_vis"
                        ></MenuItem>
                        {this.state.estado_vis_api.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <div className="o-btnBotNav-btnDiag">
                  <RedButton onClick={() => this.handleClose(false)}>
                    Cancelar
                  </RedButton>
                </div>
                <div className="o-btnBotNav-btnDiag2">
                  <GreenButton onClick={() => this.handleClose(true)}>
                    Guardar
                  </GreenButton>
                </div>
              </DialogActions>
            </Dialog>

            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={this.state.delVisit}
              onClose={() => this.handleCloseDel(false)}
              maxWidth={false}
            >
              <DialogTitle style={{ textAlign: "center" }}>
                {"¿Desea eliminar la visita?"}
              </DialogTitle>
              <DialogContent></DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <div className="o-btnBotNav-btnDiag3">
                  <RedButton onClick={() => this.handleCloseDel(true)}>
                    Eliminar
                  </RedButton>
                </div>
                <div className="o-btnBotNav-btnDiag3">
                  <GreenButton onClick={() => this.handleCloseDel(false)}>
                    Cancelar
                  </GreenButton>
                </div>
              </DialogActions>
            </Dialog>

            <Dialog
              open={this.state.createS}
              maxWidth={false}
              BackdropProps={{ style: { backgroundColor: "transparent" } }}
            >
              <DialogTitle style={{ textAlign: "center" }}>
                {"Datos inválidos o insuficientes"}
              </DialogTitle>
              <DialogContent style={{ textAlign: "center" }}>
                {"(No deben haber campos obligatorios vacíos)"}
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <div className="o-btnBotNav-btnDiag3">
                  <GreenButton
                    onClick={() => this.setState({ createS: false })}
                  >
                    {"Aceptar"}
                  </GreenButton>
                </div>
              </DialogActions>
            </Dialog>
          </div>
        </Route>
        <Route path="/consultar_visitas/tareas">
          <CrearTareas
            dbid_org={this.state.temp_id_org}
            id_vis={this.state.temp_id_vis}
            data={this.state.visita_data}
            name_org={this.state.temp_name_org}
            estado_tar_api={this.state.estado_tar_api}
            token={this.props.token}
            box_spacing={this.state.box_spacing_tiny}
            subtitle_spacing={this.state.subtitle_spacing}
            box_size={this.state.box_size_tiny}
            box_size_table={this.state.box_size_table}
          />
        </Route>
      </Switch>
    );
  }
}

export default ConsultarVisitas;
