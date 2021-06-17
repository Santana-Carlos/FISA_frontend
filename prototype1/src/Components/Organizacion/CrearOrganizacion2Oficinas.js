import React, { Component } from "react";
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
} from "@material-ui/core";
import {
  Delete as IconDelete,
  Edit as IconEdit,
  Add as IconAdd,
} from "@material-ui/icons";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
  StyledIconButton as IconButton,
} from "../Buttons";
import { Link, Redirect } from "react-router-dom";
import "../Styles.css";

const emptyCell = "-";

class CrearOrganizacion2Oficinas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      name_org: props.name_org,
      reqText: false,
      createS: false,
      dbid_org: props.dbid_org,
      temp_id_ofi: "",
      ofices: [],
      addOffice: false,
      delOffice: false,
      tipo_ofi_api: [],
      pais_ofi_api: [],
      depest_ofi_api: [],
      city_ofi_api: [],
      estado_ofi_api: [
        {
          id: true,
          nombre: "ACTIVO",
        },
        {
          id: false,
          nombre: "INACTIVO",
        },
      ],
      temp_tipo_ofi: "",
      temp_dir_ofi: "",
      temp_comdir_ofi: "",
      temp_pais_ofi: "",
      temp_depest_ofi: "",
      temp_city_ofi: "",
      temp_tel_ofi: "",
      temp_tel2_ofi: "",
      temp_pbx_ofi: "",
      temp_estado_ofi: "",
      loading: true,
      loadingDiag: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "Oficina/Data", {
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
        this.setState(
          {
            tipo_ofi_api: data.tipos,
            pais_ofi_api: data.paises,
          },
          this.callAPi
        );
      })
      .catch((error) => {});
  }

  callAPi = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "Oficina/Org", {
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
          ofices: data.oficinas,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callAPiDepes = () => {
    const data = {
      pais_id: this.state.temp_pais_ofi,
    };
    fetch(process.env.REACT_APP_API_URL + "DepartamentoEstado/Pais", {
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
          depest_ofi_api: data.estados,
        });
      })
      .catch((error) => {});
  };

  callAPiCity = () => {
    const data = {
      departamento_estado_id: this.state.temp_depest_ofi,
    };
    fetch(process.env.REACT_APP_API_URL + "Ciudad/Dep", {
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
          city_ofi_api: data.ciudades,
        });
      })
      .catch((error) => {});
  };

  handleClickOpen = () => {
    const idOfi = this.state.temp_id_ofi;
    if (idOfi !== "") {
      fetch(process.env.REACT_APP_API_URL + "Oficina/" + idOfi, {
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
          this.setState(
            {
              temp_tipo_ofi: data.oficina.tipo_oficina_id,
              temp_dir_ofi: data.oficina.direccion,
              temp_comdir_ofi: data.oficina.complemento_direccion,
              temp_pais_ofi: data.oficina.pais_id,
              temp_tel_ofi: data.oficina.telefono_1,
              temp_tel2_ofi: data.oficina.telefono_2,
              temp_pbx_ofi: data.oficina.pbx,
              temp_estado_ofi: data.oficina.estado,
              loadingDiag: false,
            },
            this.callAPiDepes
          );
          this.setState(
            {
              temp_depest_ofi: data.oficina.departamento_estado_id,
            },
            this.callAPiCity
          );
          this.setState({
            temp_city_ofi: data.oficina.ciudad_id,
          });
        })
        .catch((error) => {
          this.setState({ loadingDiag: false });
          alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
        });
    }
    this.setState({ addOffice: true });
  };

  handleClose = (a) => {
    if (a) {
      this.callApipostOficina();
    } else {
      this.clearTemp();
      this.setState({ addOffice: false, reqText: false }, () => {
        setTimeout(this.callAPi(), 2000);
      });
    }
  };

  handleClickOpenDel = () => {
    this.setState({ delOffice: true });
  };

  handleCloseDel = (a) => {
    const idOfi = this.state.temp_id_ofi;
    if (a) {
      this.setState({ loading: true });
      fetch(process.env.REACT_APP_API_URL + "Oficina/" + idOfi, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      }).catch((error) => {});
    }
    this.setState({
      delOffice: false,
      temp_id_ofi: "",
    });
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  callApipostOficina = () => {
    this.setState({ loadingDiag: true });
    const idOfi = this.state.temp_id_ofi;
    const data = {
      organizacion_id: this.props.dbid_org,
      direccion: this.state.temp_dir_ofi,
      complemento_direccion: this.state.temp_comdir_ofi,
      telefono_1: this.state.temp_tel_ofi,
      telefono_2: this.state.temp_tel2_ofi,
      pbx: this.state.temp_pbx_ofi,
      estado: this.state.temp_estado_ofi,
      tipo_oficina_id: this.state.temp_tipo_ofi,
      pais_id: this.state.temp_pais_ofi,
      departamento_estado_id: this.state.temp_depest_ofi,
      ciudad_id: this.state.temp_city_ofi,
    };
    if (idOfi === "") {
      fetch(process.env.REACT_APP_API_URL + "Oficina/", {
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
            this.clearTemp();
            this.setState({
              loading: true,
              loadingDiag: false,
              addOffice: false,
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
    } else {
      fetch(process.env.REACT_APP_API_URL + "Oficina/" + idOfi, {
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
            this.clearTemp();
            this.setState({
              loading: true,
              loadingDiag: false,
              addOffice: false,
              reqText: false,
            });
          }
        })
        .catch((error) => {
          this.setState({ loadingDiag: false, reqText: true, createS: true });
        });
    }
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  clearTemp = () => {
    this.setState({
      temp_tipo_ofi: "",
      temp_dir_ofi: "",
      temp_comdir_ofi: "",
      temp_pais_ofi: "",
      temp_depest_ofi: "",
      temp_city_ofi: "",
      temp_tel_ofi: "",
      temp_tel2_ofi: "",
      temp_pbx_ofi: "",
      temp_estado_ofi: "",
    });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_tipo_ofi":
        this.setState({ temp_tipo_ofi: value });
        break;
      case "input_dir_ofi":
        this.setState({ temp_dir_ofi: value });
        break;
      case "input_comdir_ofi":
        this.setState({ temp_comdir_ofi: value });
        break;
      case "input_pais_ofi":
        this.setState(
          { temp_pais_ofi: value, temp_depest_ofi: "", temp_city_ofi: "" },
          this.callAPiDepes
        );
        break;
      case "input_depest_ofi":
        this.setState(
          { temp_depest_ofi: value, temp_city_ofi: "" },
          this.callAPiCity
        );
        break;
      case "input_city_ofi":
        this.setState({ temp_city_ofi: value });
        break;
      case "input_tel_ofi":
        this.setState({ temp_tel_ofi: value });
        break;
      case "input_tel2_ofi":
        this.setState({ temp_tel2_ofi: value });
        break;
      case "input_pbx_ofi":
        this.setState({ temp_pbx_ofi: value });
        break;
      case "input_estado_ofi":
        this.setState({ temp_estado_ofi: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = this.props.box_spacing;
    const BOX_SIZE_TABLE = this.props.box_size_table;

    return (
      <div className="o-cardContent">
        {this.props.dbid_org === "" ? (
          <Redirect exact to="/crear_organizacion" />
        ) : null}
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Lista de oficinas</h3>
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
            {"Organización: "}
            {this.props.name_org || ""}
          </div>
        </div>
        <div className="o-contentForm-big">
          <div className="o-tableContainer">
            <TableContainer
              className="o-tableBase"
              style={{ maxHeight: BOX_SIZE_TABLE }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tipo</StyledTableCell>
                    <StyledTableCell>Ciudad - País</StyledTableCell>
                    <StyledTableCell>Dirección</StyledTableCell>
                    <StyledTableCell>Teléfono</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.ofices.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCell size="small">{obj.tipo}</StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.ciudad} - {obj.pais}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.direccion}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.telefono_1 === null ? emptyCell : obj.telefono_1}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            style={{ color: "#47B14C" }}
                            onClick={() =>
                              this.setState(
                                { loadingDiag: true, temp_id_ofi: obj.id },
                                this.handleClickOpen
                              )
                            }
                          >
                            <IconEdit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              this.setState(
                                { temp_id_ofi: obj.id },
                                this.handleClickOpenDel
                              )
                            }
                          >
                            <IconDelete />
                          </IconButton>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.ofices[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="o-btnAnadirTable">
              <BlueButton
                onClick={() =>
                  this.setState({ temp_id_ofi: "" }, this.handleClickOpen)
                }
              >
                Añadir
                <IconAdd
                  style={{ marginLeft: "0.4rem", marginRight: 0 }}
                  size="small"
                />
              </BlueButton>
            </div>
          </div>
        </div>
        <div className="o-btnBotNav">
          <div className="o-btnBotNav-btn">
            <BlueButton disabled>Anterior</BlueButton>
          </div>
          <div className="o-btnBotNavDoble">
            <Link
              exact="true"
              to="/crear_organizacion/"
              className="o-btnBotNav-btn"
            >
              <GreenButton>Finalizar</GreenButton>
            </Link>
            <Link
              to="/crear_organizacion/contactos"
              className="o-btnBotNav-btn"
            >
              <BlueButton>Siguiente</BlueButton>
            </Link>
          </div>
        </div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.addOffice}
          onClose={() => this.handleClose(false)}
          maxWidth={false}
        >
          <DialogTitle>
            <div className="o-row">
              Añadir oficina
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
                <h3 className="o-diagSubTittle">Oficina</h3>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  error={this.state.reqText && this.state.temp_tipo_ofi === ""}
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"Tipo"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.temp_tipo_ofi || ""}
                    onChange={this.handleChange}
                    label="Tipo*"
                    name="input_tipo_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.tipo_ofi_api.map((obj, i) => {
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
                    label={
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Dirección"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    name="input_dir_ofi"
                    value={this.state.temp_dir_ofi || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                    error={this.state.reqText && this.state.temp_dir_ofi === ""}
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Complemento dirección"
                    variant="outlined"
                    name="input_comdir_ofi"
                    value={this.state.temp_comdir_ofi || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>

                <h3 className="o-diagSubTittle2">Ubicación</h3>

                <FormControl
                  variant="outlined"
                  margin="dense"
                  error={this.state.reqText && this.state.temp_pais_ofi === ""}
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"País"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.temp_pais_ofi || ""}
                    onChange={this.handleChange}
                    label="País*"
                    name="input_pais_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.pais_ofi_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  disabled={this.state.temp_pais_ofi === ""}
                  error={
                    this.state.reqText && this.state.temp_depest_ofi === ""
                  }
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"Departamento/Estado"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.temp_depest_ofi || ""}
                    onChange={this.handleChange}
                    label="Departamento/Estado*"
                    name="input_depest_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.depest_ofi_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  disabled={this.state.temp_depest_ofi === ""}
                  error={this.state.reqText && this.state.temp_city_ofi === ""}
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"Ciudad"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.temp_city_ofi || ""}
                    onChange={this.handleChange}
                    label="Ciudad*"
                    name="input_city_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.city_ofi_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>

              <div className="o-contentFormDiag">
                <h3 className="o-diagSubTittle">Otros datos</h3>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Teléfono"
                    variant="outlined"
                    name="input_tel_ofi"
                    value={this.state.temp_tel_ofi || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Teléfono alternativo"
                    variant="outlined"
                    name="input_tel2_ofi"
                    value={this.state.temp_tel2_ofi || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="PBX"
                    variant="outlined"
                    name="input_pbx_ofi"
                    value={this.state.temp_pbx_ofi || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  error={
                    this.state.reqText && this.state.temp_estado_ofi === ""
                  }
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"Estado"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.temp_estado_ofi}
                    onChange={this.handleChange}
                    label="Estado*"
                    name="input_estado_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.estado_ofi_api.map((obj, i) => {
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
          open={this.state.delOffice}
          onClose={() => this.handleCloseDel(false)}
          maxWidth={false}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            ¿Desea eliminar la oficina?
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
            {
              "Puede haber superado el número máximo de caracteres en algún campo"
            }
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <div className="o-btnBotNav-btnDiag3">
              <GreenButton onClick={() => this.setState({ createS: false })}>
                {"Aceptar"}
              </GreenButton>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CrearOrganizacion2Oficinas;
