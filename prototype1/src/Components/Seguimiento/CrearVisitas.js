import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
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
  TablePagination,
  Checkbox,
  Fade,
  CircularProgress,
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
} from "../Buttons";
import {
  AddCircleOutline as IconAddCircle,
  Refresh as IconRefresh,
} from "@material-ui/icons";
import { Switch, Route } from "react-router-dom";
import CrearTareas from "./CrearTareas";
import "../Styles.css";

const items = [
  "organizacions.numero_documento",
  "organizacions.nombre",
  "organizacions.razon_social",
];

const emptyCell = "-";

class CrearVisitas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      tipoid_org: "",
      nid_org: "",
      cat_org: [],
      nomcom_org: "",
      razsoc_org: "",
      errorSearch: false,
      createS: false,
      reqText: false,
      orgs: [],
      tipoid_org_api: [],
      cat_org_api: [],
      temp_id_org: "",
      temp_name_org: "",
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
      temp_asignados: [],
      temp_estado_vis: "",
      users_api: [],
      contacto_org_api: [],
      oficina_org_api: [],
      estado_vis_api: [],
      estado_tar_api: [],
      addVisit: false,
      loading: true,
      loadingDiag: false,
      currentPage: 0,
      rowsPerPage: 25,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "34rem" : "18rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCon = this.handleChangeCon.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "34rem" : "18rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
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
        });
      })
      .catch((error) => {});
    fetch(process.env.REACT_APP_API_URL + "Organizacion/Data", {
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
          tipoid_org_api: data.documentos,
          cat_org_api: data.categorias,
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
    fetch(process.env.REACT_APP_API_URL + "Organizacion", {
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
            orgs: data.organizaciones,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
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
        this.setState({
          contacto_org_api: data.contactos,
          oficina_org_api: data.oficinas,
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  apiSearch = (e) => {
    e?.preventDefault();
    this.setState({ loading: true });

    const numero =
      this.state.nid_org === "" ? "%" : "%" + this.state.nid_org + "%";
    const nombre =
      this.state.nomcom_org === "" ? "%" : "%" + this.state.nomcom_org + "%";
    const razon =
      this.state.razsoc_org === "" ? "%" : "%" + this.state.razsoc_org + "%";
    const documento =
      this.state.tipoid_org === ""
        ? this.state.tipoid_org_api.map((obj) => obj.id)
        : [this.state.tipoid_org];
    const categoria =
      this.state.cat_org[0] === undefined
        ? this.state.cat_org_api.map((obj) => obj.id)
        : this.state.cat_org.map((obj) => obj.id);

    const palabra1 = items[0];
    const palabra2 = items[1];
    const palabra3 = this.state.razsoc_org === "" ? items[1] : items[2];

    const data = {
      numero_documento: numero,
      nombre: nombre,
      razon_social: razon,
      documentos: documento,
      categorias: categoria,
      parametros: [palabra1, palabra2, palabra3],
    };
    //console.log(data);
    if (
      this.state.nid_org !== "" ||
      this.state.nomcom_org !== "" ||
      this.state.razsoc_org !== "" ||
      this.state.tipoid_org !== "" ||
      this.state.cat_org[0] !== undefined
    ) {
      fetch(process.env.REACT_APP_API_URL + "Organizacion/Search", {
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
              orgs: data.organizaciones,
              reqText: false,
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({ loading: false, reqText: true, errorSearch: true });
      this.callAPi();
    }
  };

  apiRefresh = () => {
    this.setState({ loading: true });
    if (
      this.state.nid_org !== "" ||
      this.state.nomcom_org !== "" ||
      this.state.razsoc_org !== "" ||
      this.state.tipoid_org !== "" ||
      this.state.cat_org[0] !== undefined
    ) {
      this.apiSearch();
    } else {
      this.callAPi();
    }
  };

  editVis = () => {
    window.location.assign(
      "/dashboard/organizacion#/consultar_organizacion/editar"
    );
  };

  clearFunc = () => {
    this.setState(
      {
        loading: true,
        tipoid_org: "",
        nid_org: "",
        nomcom_org: "",
        razsoc_org: "",
        cat_org: [],
        reqText: false,
      },
      this.callAPi()
    );
  };

  handleClose = (a) => {
    if (a) {
      this.callApipostVisita();
    } else {
      this.clearTemp();
      this.setState({ addVisit: false, reqText: false });
    }
  };

  callApipostVisita = () => {
    this.setState({
      loadingDiag: true,
      visita_data: {
        fecha_programada:
          this.state.temp_fecpro_vis === ""
            ? this.state.temp_fecpro_vis
            : this.state.temp_fecpro_vis.getFullYear() +
              "-" +
              this.state.temp_fecpro_vis.getDate() +
              "-" +
              this.state.temp_fecpro_vis.getDay(),
        titulo: this.state.temp_titulo_vis,
      },
    });
    const data = {
      organizacion_id: this.state.temp_id_org,
      contacto_id: this.state.temp_id_con,
      oficina_id: this.state.temp_id_ofi,
      fecha_programada: this.state.temp_fecpro_vis,
      fecha_ejecucion: this.state.temp_feceje_vis,
      titulo: this.state.temp_titulo_vis,
      observaciones: this.state.temp_obs_vis,
      resultado: this.state.temp_res_vis,
      estado_id: this.state.temp_estado_vis,
      asignados: this.state.temp_asignados.map((obj) => obj.id),
    };

    fetch(process.env.REACT_APP_API_URL + "Visita/", {
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
          // console.log(data);
          this.setState({
            temp_id_vis: data.visita,
            loadingDiag: false,
            addVisit: false,
            reqText: false,
          });
          window.location.assign(
            "/dashboard/seguimiento#/crear_visitas/tareas"
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

  clearTemp = () => {
    this.setState({
      temp_id_org: "",
      temp_id_con: "",
      temp_id_ofi: "",
      temp_fecpro_vis: "",
      temp_feceje_vis: "",
      temp_titulo_vis: "",
      temp_obs_vis: "",
      temp_res_vis: "",
      temp_temp_asignados: [],
      temp_estado_vis: "",
      reqText: false,
    });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_tipoid_org":
        this.setState({ tipoid_org: value, tipoid2_org: value });
        break;
      case "input_nid_org":
        this.setState({ nid_org: value });
        break;
      case "input_cat_org":
        this.setState({ cat_org: value });
        break;
      case "input_nomcom_org":
        this.setState({ nomcom_org: value });
        break;
      case "input_razsoc_org":
        this.setState({ razsoc_org: value });
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

  render() {
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE = this.state.box_size;
    const currentPage = this.state.currentPage;
    const rowsPerPage = this.state.rowsPerPage;

    return (
      <Switch>
        <Route exact path="/crear_visitas">
          <div className="o-cardContent">
            <div className="o-contentTittle">
              <h3
                className="o-contentTittle-principal"
                style={{ marginTop: "0.2rem" }}
              >
                Lista de organizaciones
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
              <form>
                <div className="o-consultas-containerInit">
                  <div className="o-consultas">
                    <div style={{ marginBottom: BOX_SPACING }}>
                      <div className="o-dobleInput">
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          className="o-selectShort"
                          style={{ width: "7rem" }}
                        >
                          <InputLabel>ID</InputLabel>
                          <Select
                            value={this.state.tipoid_org || ""}
                            onChange={this.handleChange}
                            label="ID"
                            name="input_tipoid_org"
                          >
                            <MenuItem value="">Ninguno</MenuItem>
                            {this.state.tipoid_org_api.map((obj, i) => {
                              return (
                                <MenuItem key={i} value={obj.id}>
                                  {obj.nombre}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <div
                          className="o-inputShort"
                          style={{ marginLeft: "0.5rem" }}
                        >
                          <TextField
                            label="Número"
                            variant="outlined"
                            value={this.state.nid_org || ""}
                            name="input_nid_org"
                            onChange={this.handleChange}
                            className="o-space"
                            margin="dense"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="o-consultas">
                    <TextField
                      label="Nombre comercial"
                      variant="outlined"
                      name="input_nomcom_org"
                      value={this.state.nomcom_org || ""}
                      onChange={this.handleChange}
                      className="o-space"
                      margin="dense"
                    />
                  </div>
                  <div className="o-consultas">
                    <TextField
                      label="Razón social"
                      variant="outlined"
                      name="input_razsoc_org"
                      value={this.state.razsoc_org || ""}
                      onChange={this.handleChange}
                      className="o-space"
                      margin="dense"
                    />
                  </div>
                  <FormControl
                    className="o-consultas"
                    style={{ margin: "0.8rem 0 0" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      multiple
                      label="Categoría"
                      name="input_cat_org"
                      className="o-space"
                      value={this.state.cat_org || []}
                      onChange={this.handleChange}
                      MenuProps={{
                        getContentAnchorEl: () => null,
                      }}
                      renderValue={(selected) =>
                        selected.map((value) => value.nombre + ", ")
                      }
                      style={{ marginBottom: BOX_SPACING }}
                    >
                      {this.state.cat_org_api.map((obj, i) => (
                        <MenuItem key={i} value={obj}>
                          <Checkbox
                            checked={
                              this.state.cat_org.findIndex(
                                (x) => x.id === obj.id
                              ) > -1
                            }
                          />
                          <ListItemText primary={obj.nombre} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="o-consultas-container">
                  <div className="o-consultas-btn">
                    <div className="o-btnConsultas">
                      <BlueButton type="submit" onClick={this.apiSearch}>
                        Buscar
                      </BlueButton>
                    </div>
                    <div className="o-btnConsultas">
                      <RedButton onClick={this.clearFunc}>Limpiar</RedButton>
                    </div>
                    <div className="o-btnConsultas" style={{ width: "4rem" }}>
                      <BlueButton onClick={this.apiRefresh}>
                        <IconRefresh size="small" />
                      </BlueButton>
                    </div>
                  </div>
                </div>
              </form>
              <TableContainer
                className="o-tableBase-consultas"
                style={{ display: "inline", height: BOX_SIZE }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Nombre</StyledTableCell>
                      <StyledTableCell>Identificación</StyledTableCell>
                      <StyledTableCell>Razón social</StyledTableCell>
                      <StyledTableCell>Categoría</StyledTableCell>
                      <StyledTableCell>Subsector</StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.orgs
                      .slice(
                        currentPage * rowsPerPage,
                        currentPage * rowsPerPage + rowsPerPage
                      )
                      .map((obj, i) => (
                        <TableRow key={i} hover={true}>
                          <StyledTableCell size="small">
                            {obj.nombre}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.tipo_documento_organizacion +
                              " " +
                              obj.numero_documento}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.razon_social === null
                              ? emptyCell
                              : obj.razon_social}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.categoria}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.subsector === null ? emptyCell : obj.subsector}
                          </StyledTableCell>
                          <StyledTableCell size="small" align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                this.setState(
                                  {
                                    temp_id_org: obj.id,
                                    temp_name_org: obj.nombre,
                                    addVisit: true,
                                  },
                                  this.callApiOrg
                                )
                              }
                            >
                              <IconAddCircle />
                            </IconButton>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    {this.state.orgs[0] === undefined ? (
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
                count={this.state.orgs.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onChangePage={(e, page) => this.setState({ currentPage: page })}
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
                  `${from} - ${to} de ${count !== -1 ? count : `más que ${to}`}`
                }
              />
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
                    >
                      <InputLabel>Oficina</InputLabel>
                      <Select
                        value={this.state.temp_id_ofi}
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
                          selected.map((value) => value.usuario + ", ")
                        }
                        style={{ marginBottom: BOX_SPACING }}
                      >
                        {this.state.users_api.map((obj, i) => (
                          <MenuItem key={i} value={obj}>
                            <Checkbox
                              checked={
                                this.state.temp_asignados.findIndex(
                                  (x) => x.id === obj.id
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
                        value={this.state.temp_estado_vis}
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
                <div className="o-btnBotNav-btnDiag2">
                  <GreenButton
                    onClick={() => this.handleClose(true)}
                    disabled={this.state.temp_asignados.length < 1}
                  >
                    Guardar
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
            <Dialog open={this.state.errorSearch} maxWidth={false}>
              <DialogTitle style={{ textAlign: "center" }}>
                {"No se pudo buscar"}
              </DialogTitle>
              <DialogContent style={{ textAlign: "center" }}>
                {
                  "(Para realizar una busqueda debe ingresar al menos un parametro)"
                }
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <div className="o-btnBotNav-btnDiag3">
                  <GreenButton
                    onClick={() => this.setState({ errorSearch: false })}
                  >
                    {"Aceptar"}
                  </GreenButton>
                </div>
              </DialogActions>
            </Dialog>
          </div>
        </Route>
        <Route path="/crear_visitas/tareas">
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

export default CrearVisitas;
