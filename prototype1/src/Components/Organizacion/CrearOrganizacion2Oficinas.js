import React, { Component } from "react";
import {
  IconButton,
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
} from "../Buttons";
import { Link, Redirect } from "react-router-dom";
import "../Styles.css";

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
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/auth/Oficina/Data", {
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
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  callAPi = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch("http://localhost:8000/api/auth/Oficina/Org", {
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
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  callAPiDepes = () => {
    const data = {
      pais_id: this.state.temp_pais_ofi,
    };
    fetch("http://localhost:8000/api/auth/DepartamentoEstado/Pais", {
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
    fetch("http://localhost:8000/api/auth/Ciudad/Dep", {
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
      fetch("http://localhost:8000/api/auth/Oficina/" + idOfi, {
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
        .catch((error) => {});
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
      fetch("http://localhost:8000/api/auth/Oficina/" + idOfi, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      }).catch((error) => {
        console.error("Error:", error);
      });
    }
    this.setState({
      delOffice: false,
      temp_id_ofi: "",
    });
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
    setTimeout(this.callAPi, 10000);
  };

  callApipostOficina = () => {
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
      fetch("http://localhost:8000/api/auth/Oficina/", {
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
            this.setState({ addOffice: false, reqText: false });
          }
        })
        .catch((error) => {
          this.setState({ reqText: true, createS: true });
        });
    } else {
      fetch("http://localhost:8000/api/auth/Oficina/" + idOfi, {
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
            this.setState({ addOffice: "", reqText: false });
          }
        })
        .catch((error) => {
          this.setState({ reqText: true, createS: true });
        });
    }
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
    setTimeout(this.callAPi, 10000);
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
        this.setState({ temp_pais_ofi: value }, this.callAPiDepes);
        break;
      case "input_depest_ofi":
        this.setState({ temp_depest_ofi: value }, this.callAPiCity);
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
    const BOX_SPACING = window.innerHeight > 900 ? "0.4rem" : "0rem";
    return (
      <div className="o-cardContent">
        {this.props.dbid_org === "" ? (
          <Redirect exact to="/crear_organizacion" />
        ) : null}
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Lista de oficinas</h3>
          <div className="o-text-nameOrg">
            {" "}
            {"Organización: "}
            {this.props.name_org || ""}
          </div>
        </div>
        <div className="o-contentForm-big">
          <div className="o-tableContainer">
            <TableContainer className="o-tableBase">
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tipo</StyledTableCell>
                    <StyledTableCell>Ciudad - País</StyledTableCell>
                    <StyledTableCell>Dirección</StyledTableCell>
                    <StyledTableCell>Teléfono</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.ofices.map((obj, i) => (
                    <TableRow key={i}>
                      <StyledTableCell size="small">{obj.tipo}</StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.ciudad} - {obj.pais}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.direccion}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.telefono_1}
                      </StyledTableCell>
                      <StyledTableCell
                        size="small"
                        style={{ paddingRight: "0.1rem" }}
                      >
                        <IconButton
                          size="small"
                          className="o-tinyBtn"
                          style={{ color: "#47B14C" }}
                          onClick={() =>
                            this.setState(
                              { temp_id_ofi: obj.id },
                              this.handleClickOpen
                            )
                          }
                        >
                          <IconEdit />
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
                              { temp_id_ofi: obj.id },
                              this.handleClickOpenDel
                            )
                          }
                        >
                          <IconDelete />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.ofices[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
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
                  <InputLabel id="demo-simple-select-outlined-label">
                    Tipo*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_tipo_ofi || ""}
                    onChange={this.handleChange}
                    label="Tipo*"
                    name="input_tipo_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem disabled={true} value="input_tipo_ofi"></MenuItem>
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
                    label="Dirección*"
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
                  <InputLabel id="demo-simple-select-outlined-label">
                    País*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_pais_ofi || ""}
                    onChange={this.handleChange}
                    label="País*"
                    name="input_pais_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem disabled={true} value="input_pais_ofi"></MenuItem>
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
                  <InputLabel id="demo-simple-select-outlined-label">
                    Departamento/Estado*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_depest_ofi || ""}
                    onChange={this.handleChange}
                    label="Departamento/Estado*"
                    name="input_depest_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_depest_ofi"
                    ></MenuItem>
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
                  <InputLabel id="demo-simple-select-outlined-label">
                    Ciudad*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_city_ofi || ""}
                    onChange={this.handleChange}
                    label="Ciudad*"
                    name="input_city_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem
                      visible={"false"}
                      value="input_city_ofi"
                    ></MenuItem>
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
                  <InputLabel id="demo-simple-select-outlined-label">
                    Estado*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_estado_ofi}
                    onChange={this.handleChange}
                    label="Estado*"
                    name="input_estado_ofi"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_estado_ofi"
                    ></MenuItem>
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
            {"(Puede que la oficina ya exista)"}
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
