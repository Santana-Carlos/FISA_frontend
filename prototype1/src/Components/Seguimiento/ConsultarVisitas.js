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
  Fade,
  CircularProgress,
  Checkbox,
  ListItemText,
  Tooltip,
  TablePagination,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
  StyledIconButton as IconButton,
  CustomDateRangePicker,
} from "../Buttons";
import { Delete as IconDelete, ZoomIn as IconSelect } from "@material-ui/icons";
import { Switch, Route } from "react-router-dom";
import CrearTareas from "./CrearTareas";
import "../Styles.css";

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
      temp_motivo_vis: "",
      temp_obs_vis: "",
      temp_res_vis: "",
      temp_asignados: [],
      temp_estado_vis: "",
      temp_userUdate_vis: "",
      temp_dateUdate_vis: "",
      users_api: [],
      contacto_org_api: [],
      oficina_org_api: [],
      motivo_tar_api: [],
      estado_tar_api: [],
      motivo_vis_api: [],
      estado_vis_api: [],
      search_org: "",
      search_motivo: "",
      search_date_ini: "",
      search_date_fin: "",
      addVisit: false,
      delVisit: false,
      loading: true,
      loadingDiag: false,
      currentPage: 0,
      rowsPerPage: 25,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
      box_size:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 160px)"
          : "calc(100vh - 5.9rem - 128px)",
      box_size2:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 142px)"
          : "calc(100vh - 5.9rem - 113px)",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCon = this.handleChangeCon.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
      box_size:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 160px)"
          : "calc(100vh - 5.9rem - 128px)",
      box_size2:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 142px)"
          : "calc(100vh - 5.9rem - 113px)",
    });
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "Visita/Data", {
      method: "POST",
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
          motivo_vis_api: data.motivoVisitas,
          motivo_tar_api: data.motivoTareas,
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

  callAPi = (x) => {
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
    if (x !== "put") {
      this.setState({
        temp_motivo_vis: "",
        temp_id_vis: "",
      });
    }
  };

  apiSearch = (e) => {
    e?.preventDefault();
    this.setState({ loading: true });
    const data = {
      organizacion: this.state.search_org,
      motivo_id: this.state.search_motivo,
      fecha_inicio: this.state.search_date_ini,
      fecha_fin: this.state.search_date_fin,
    };
    //console.log(data);
    if (
      this.state.search_motivo !== "" ||
      this.state.search_org !== "" ||
      (this.state.search_date_ini !== "" && this.state.search_date_fin !== ""
        ? this.state.search_date_ini <= this.state.search_date_fin
        : this.state.search_date_ini !== "" ||
          this.state.search_date_fin !== "")
    ) {
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
        search_org: "",
        search_motivo: "",
        search_date_ini: "",
        search_date_fin: "",
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
              temp_motivo_vis: data.visita.motivo_id,
              temp_obs_vis: data.visita.observaciones,
              temp_res_vis: data.visita.resultado,
              temp_asignados: data.asignados?.map((obj) => obj.id),
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
      motivo_id: this.state.temp_motivo_vis,
      observaciones: this.state.temp_obs_vis,
      resultado: this.state.temp_res_vis,
      asignados: this.state.temp_asignados,
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
          this.setState(
            {
              loadingDiag: false,
              addVisit: false,
              reqText: false,
            },
            () => {
              this.callAPi("put");
              this.selVisita();
            }
          );
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
      case "input_search_org":
        this.setState({ search_org: value });
        break;
      case "input_search_motivo":
        this.setState({ search_motivo: value });
        break;
      case "input_id_motivo":
        this.setState({ temp_motivo_vis: value });
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
        this.setState({ temp_asignados: value });
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

  handleChangeDateIni = (date) => {
    if (date !== null && date !== "") {
      this.setState({ search_date_ini: date });
    } else {
      this.setState({ search_date_ini: "" });
    }
  };

  handleChangeDateFin = (date) => {
    if (date !== null && date !== "") {
      this.setState({ search_date_fin: date });
    } else {
      this.setState({ search_date_fin: "" });
    }
  };

  render() {
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE = this.state.box_size;
    const BOX_SIZE2 = this.state.box_size2;
    const currentPage = this.state.currentPage;
    const rowsPerPage = this.state.rowsPerPage;
    const rol = this.props.rol;

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
              <form className="o-consultas-containerInit">
                <FormControl
                  className="o-consultas"
                  style={{ margin: "0.8rem 1rem 0 0", width: 495 }}
                  variant="outlined"
                  margin="dense"
                >
                  <InputLabel>Motivo</InputLabel>
                  <Select
                    value={this.state.search_motivo || ""}
                    onChange={this.handleChange}
                    label="Motivo"
                    name="input_search_motivo"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.motivo_vis_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <div className="o-consultas" style={{ width: 800 }}>
                  <TextField
                    label="Organización"
                    variant="outlined"
                    name="input_search_org"
                    value={this.state.search_org || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>

                <CustomDateRangePicker
                  labelInput={"Rango de fechas"}
                  label1={"Fecha inicial"}
                  label2={"Fecha final"}
                  value1={this.state.search_date_ini || null}
                  value2={this.state.search_date_fin || null}
                  funct1={(date) => this.handleChangeDateIni(date)}
                  funct2={(date) => this.handleChangeDateFin(date)}
                  formstyle={{ margin: "0.8rem 1rem 0 0", width: 800 }}
                  classesname={"o-consultas"}
                />

                <div className="o-consultas-btnxn">
                  <div className="o-btnConsultas">
                    <BlueButton type="submit" onClick={this.apiSearch}>
                      Filtrar
                    </BlueButton>
                  </div>
                  <div className="o-btnConsultas">
                    <RedButton onClick={this.clearFunc}>Limpiar</RedButton>
                  </div>
                  <div className="o-btnConsultas" style={{ width: "6.4rem" }}>
                    <BlueButton onClick={this.apiToday}>Próximas</BlueButton>
                  </div>
                </div>
              </form>
              <div
                className="o-contentForm-big-consultasHalf"
                style={{ flexDirection: "column", width: "70%" }}
              >
                <TableContainer
                  className="o-tableBase-consultas"
                  style={{
                    display: "inline",
                    height: BOX_SIZE,
                    marginBottom: "auto",
                  }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Organización</StyledTableCell>
                        <StyledTableCell>Fecha</StyledTableCell>
                        <StyledTableCell>Motivo</StyledTableCell>
                        <StyledTableCell>Tareas</StyledTableCell>
                        <StyledTableCell>Estado</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.visitas
                        .slice(
                          currentPage * rowsPerPage,
                          currentPage * rowsPerPage + rowsPerPage
                        )
                        .map((obj, i) => (
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
                              {obj.motivo}
                            </StyledTableCell>
                            <StyledTableCell size="small">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: 75,
                                  fontSize: 12,
                                  color: "#FFF",
                                }}
                              >
                                <Tooltip title="Completadas" placement="top">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 20,
                                      height: 20,
                                      borderRadius: 10,
                                      backgroundColor: "#32A852",
                                    }}
                                  >
                                    {obj.tareasHechas || "0"}
                                  </div>
                                </Tooltip>
                                <Tooltip title="Pendientes" placement="top">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 20,
                                      height: 20,
                                      borderRadius: 10,
                                      backgroundColor: "#DE3C3C",
                                    }}
                                  >
                                    {obj.tareasPendientes || "0"}
                                  </div>
                                </Tooltip>
                                <Tooltip title="Totales" placement="top">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 20,
                                      height: 20,
                                      borderRadius: 10,
                                      backgroundColor: "#3F51B5",
                                    }}
                                  >
                                    {obj.tareasTotales || "0"}
                                  </div>
                                </Tooltip>
                              </div>
                            </StyledTableCell>
                            <StyledTableCell size="small">
                              {obj.estado}
                            </StyledTableCell>
                            <StyledTableCell size="small" align="right">
                              <div className="o-row-btnIcon">
                                <IconButton
                                  size="small"
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
                                {rol !== "Comercial" && rol !== "Consulta" ? (
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
                                ) : null}
                              </div>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      {this.state.visitas[0] === undefined ? (
                        <TableRow>
                          <StyledTableCell>...</StyledTableCell>
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component={"div"}
                  style={{
                    margin: "0 0 0 auto",
                  }}
                  rowsPerPageOptions={[15, 25, 45]}
                  colSpan={9}
                  count={this.state.visitas.length}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  onChangePage={(e, page) =>
                    this.setState({ currentPage: page })
                  }
                  onChangeRowsPerPage={(e) =>
                    this.setState({
                      currentPage: 0,
                      rowsPerPage: parseInt(e.target.value, 10),
                    })
                  }
                  labelRowsPerPage="Filas por página"
                  nextIconButtonText="Siguiente página"
                  backIconButtonText="Página anterior"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from} - ${to} de ${
                      count !== -1 ? count : `más que ${to}`
                    }`
                  }
                />
              </div>
              <div
                className="o-card-VisitaView"
                style={{
                  minHeight: BOX_SIZE2,
                  maxHeight: BOX_SIZE2,
                  marginBottom: "auto",
                }}
              >
                {this.state.temp_motivo_vis === "" ? (
                  <div style={{ margin: "3rem auto", color: "gray" }}>
                    {"Selecciona una visita"}
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <div
                      className="o-textMain2"
                      style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}
                    >
                      {
                        this.state.motivo_vis_api?.[
                          this.state.motivo_vis_api.findIndex(
                            (x) => x.id === this.state.temp_motivo_vis
                          )
                        ]?.nombre
                      }
                    </div>
                    <div
                      className="o-textMain2"
                      style={{
                        marginBottom: "1.2rem",
                        maxHeight: "4.3rem",
                        overflowY: "auto",
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
                        <div className="o-textSub2">{"Asignado:"}</div>
                        {this.state.users_api[
                          this.state.users_api.findIndex(
                            (x) => x.id === this.state.temp_asignados?.[0]
                          )
                        ]?.usuario || "-"}
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
                          ]?.nombre
                        }
                      </div>
                    </div>

                    <div className="o-textMain2">
                      <div>
                        <div className="o-textSub2">
                          {"Última actualización:"}
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
                          {rol !== "Comercial" && rol !== "Consulta"
                            ? "Editar"
                            : "Ver"}
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

                    <FormControl
                      variant="outlined"
                      margin="dense"
                      style={{ maxWidth: "100%" }}
                      error={
                        this.state.reqText && this.state.temp_motivo_vis === ""
                      }
                    >
                      <InputLabel>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          {"Motivo"}
                          <div
                            style={{ color: "#FF0000", marginLeft: "0.1rem" }}
                          >
                            {"*"}
                          </div>
                        </div>
                      </InputLabel>
                      <Select
                        value={this.state.temp_motivo_vis}
                        onChange={this.handleChange}
                        label="Motivo*"
                        name="input_id_motivo"
                        className="o-space"
                        style={{ marginBottom: BOX_SPACING }}
                      >
                        {this.state.motivo_vis_api.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <div style={{ marginBottom: BOX_SPACING }}>
                      <TextField
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
                          " " +
                          option.apellidos +
                          (option.celular === null
                            ? ""
                            : " - Cel. " + option.celular) +
                          (option.telefono === null
                            ? ""
                            : " - Tel." + option.telefono) +
                          (option.extension === null
                            ? ""
                            : " - Ext. " + option.extension)
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
                      style={{ maxWidth: "100%" }}
                      error={
                        this.state.reqText && this.state.temp_estado_vis === ""
                      }
                    >
                      <InputLabel>Oficina</InputLabel>
                      <Select
                        value={this.state.temp_id_ofi || ""}
                        onChange={this.handleChange}
                        label="Oficina"
                        name="input_id_ofi"
                        className="o-space"
                        style={{ marginBottom: 0 }}
                      >
                        {this.state.oficina_org_api.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.direccion}{" "}
                              {obj.ciudad + " " + obj.departamento_estado} -{" "}
                              {obj.pais}
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
                        <KeyboardDatePicker
                          disableToolbar
                          inputVariant="outlined"
                          variant="inline"
                          format="dd/MM/yyyy"
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
                        <KeyboardDatePicker
                          disableToolbar
                          inputVariant="outlined"
                          variant="inline"
                          format="dd/MM/yyyy"
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
                      style={{ width: "100%" }}
                      variant="outlined"
                      margin="dense"
                      error={
                        this.state.reqText &&
                        this.state.temp_asignados.length < 1
                      }
                    >
                      <InputLabel>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          {"Usuarios asignados"}
                          <div
                            style={{ color: "#FF0000", marginLeft: "0.1rem" }}
                          >
                            {"*"}
                          </div>
                        </div>
                      </InputLabel>
                      <Select
                        multiple
                        label="Usuarios asignados*"
                        name="input_userasig_vis"
                        className="o-space"
                        value={this.state.temp_asignados || []}
                        onChange={this.handleChange}
                        MenuProps={{
                          getContentAnchorEl: () => null,
                        }}
                        renderValue={(selected) =>
                          selected.map(
                            (value) =>
                              this.state.users_api[
                                this.state.users_api.findIndex(
                                  (x) => x.id === value
                                )
                              ].usuario + ", "
                          )
                        }
                        style={{ marginBottom: BOX_SPACING }}
                      >
                        {this.state.users_api.map((obj, i) => (
                          <MenuItem key={i} value={obj.id}>
                            <Checkbox
                              checked={
                                this.state.temp_asignados.findIndex(
                                  (x) => x === obj.id
                                ) > -1
                              }
                            />
                            <ListItemText primary={obj.usuario} />
                          </MenuItem>
                        ))}
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
                      <InputLabel>
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
                        value={this.state.temp_estado_vis || ""}
                        onChange={this.handleChange}
                        label="Estado*"
                        name="input_estado_vis"
                        className="o-space"
                        style={{ marginBottom: 0 }}
                      >
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
                {rol !== "Comercial" && rol !== "Consulta" ? (
                  <div className="o-btnBotNav-btnDiag2">
                    <GreenButton
                      onClick={() => this.handleClose(true)}
                      disabled={this.state.temp_asignados.length < 1}
                    >
                      Guardar
                    </GreenButton>
                  </div>
                ) : null}
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

            <Dialog open={this.state.createS} maxWidth={false}>
              <DialogTitle style={{ textAlign: "center" }}>
                {"No se pudo buscar"}
              </DialogTitle>
              <DialogContent style={{ textAlign: "center" }}>
                {
                  "Debes agregar al menos un parámetro de búsqueda y la fecha inicial no debe ser mayor que la final"
                }
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
            motivo_tar_api={this.state.motivo_tar_api}
            token={this.props.token}
            rol={this.props.rol}
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
