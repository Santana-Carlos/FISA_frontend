import React, { Component } from "react";
import {
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
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
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCellTiny as StyledTableCell,
  StyledIconButton as IconButton,
} from "../Buttons";
import {
  Delete as IconDelete,
  Edit as IconEdit,
  Add as IconAdd,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import "../Styles.css";

class ControlUsuarios extends Component {
  constructor(props) {
    super();
    this.state = {
      api_users_seg: [],
      temp_accion: "",
      temp_id: "",
      temp_color: "#bdbdbd",
      temp_tipoid_seg: "",
      temp_nid_seg: "",
      temp_nombre_seg: "",
      temp_apell_seg: "",
      temp_email_seg: "",
      temp_estado_seg: "",
      temp_user_seg: "",
      temp_rol_seg: "",
      temp_pass_seg: "",
      temp_passcon_seg: "",
      api_tipoid_seg: [],
      api_rol_seg: [],
      api_estado_seg: [
        {
          id: true,
          nombre: "ACTIVO",
        },
        {
          id: false,
          nombre: "INACTIVO",
        },
      ],
      loading: true,
      delDato: false,
      createS: false,
      showpass: false,
      showpasscon: false,
      box_spacing: window.innerHeight > 900 ? "0.8rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "40.15rem" : "22.15rem",
      box_sizeBig: window.innerHeight > 900 ? "40.45rem" : "22.45rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.8rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "40.15rem" : "22.15rem",
      box_sizeBig: window.innerHeight > 900 ? "40.45rem" : "22.45rem",
    });
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "User/Data", {
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
        //console.log(data);
        if (data.success) {
          this.setState({
            api_rol_seg: data.roles,
            api_tipoid_seg: data.tipo_documentos,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
    this.callApi();
    this.setState({
      winInterval: window.setInterval(this.resizeBox, 1000),
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.winInterval);
  }

  callApi = () => {
    fetch(process.env.REACT_APP_API_URL + "User", {
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
          this.setState({
            api_users_seg: data.usuarios,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiGet = () => {
    this.clearTemp();
    const id = this.state.temp_id;
    fetch(process.env.REACT_APP_API_URL + "User/" + id, {
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
          this.setState({
            temp_tipoid_seg: data.usuario.tipo_documento_persona_id,
            temp_nid_seg: data.usuario.numero_documento,
            temp_nombre_seg: data.usuario.nombres,
            temp_apell_seg: data.usuario.apellidos,
            temp_email_seg: data.usuario.email,
            temp_estado_seg: data.usuario.estado,
            temp_user_seg: data.usuario.usuario,
            temp_rol_seg: data.usuario.rol_id,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleClose = () => {
    const accion = this.state.temp_accion;
    if (this.state.temp_pass_seg === this.state.temp_passcon_seg)
      switch (accion) {
        case "a":
          this.callApiAdd();
          break;
        case "e":
          this.callApiEdit();
          break;
        default:
          break;
      }
  };

  callApiAdd = () => {
    this.setState({ loading: true });
    const data = {
      tipo_documento_persona_id: this.state.temp_tipoid_seg,
      numero_documento: this.state.temp_nid_seg,
      nombres: this.state.temp_nombre_seg,
      apellidos: this.state.temp_apell_seg,
      email: this.state.temp_email_seg,
      estado: this.state.temp_estado_seg,
      usuario: this.state.temp_user_seg,
      password: this.state.temp_pass_seg,
      rol: this.state.temp_rol_seg,
    };
    fetch(process.env.REACT_APP_API_URL + "User", {
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
          this.setState(
            {
              temp_accion: "",
              temp_color: "#bdbdbd",
              loading: false,
            },
            this.callApi()
          );
          this.clearTemp();
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          temp_accion: "",
          temp_color: "#bdbdbd",
          loading: false,
          createS: true,
        });
      });
  };

  callApiEdit = () => {
    this.setState({ loading: true });
    const id = this.state.temp_id;
    const data =
      this.state.temp_pass_seg === ""
        ? {
            tipo_documento_persona_id: this.state.temp_tipoid_seg,
            numero_documento: this.state.temp_nid_seg,
            nombres: this.state.temp_nombre_seg,
            apellidos: this.state.temp_apell_seg,
            email: this.state.temp_email_seg,
            estado: this.state.temp_estado_seg,
            usuario: this.state.temp_user_seg,
            rol: this.state.temp_rol_seg,
          }
        : {
            tipo_documento_persona_id: this.state.temp_tipoid_seg,
            numero_documento: this.state.temp_nid_seg,
            nombres: this.state.temp_nombre_seg,
            apellidos: this.state.temp_apell_seg,
            email: this.state.temp_email_seg,
            estado: this.state.temp_estado_seg,
            usuario: this.state.temp_user_seg,
            password: this.state.temp_pass_seg,
            rol: this.state.temp_rol_seg,
          };
    fetch(process.env.REACT_APP_API_URL + "User/" + id, {
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
              temp_accion: "",
              temp_color: "#bdbdbd",
              loading: false,
            },
            this.callApi()
          );
          this.clearTemp();
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          temp_accion: "",
          temp_color: "#bdbdbd",
          loading: false,
          createS: true,
        });
      });
  };

  callApiDel = () => {
    const id = this.state.temp_id;
    fetch(process.env.REACT_APP_API_URL + "User/" + id, {
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
        //console.log(data);
        if (data.success) {
          this.setState(
            {
              temp_id: "",
              loading: false,
            },
            this.callApi
          );
        }
      })
      .catch((error) => {
        this.setState({ temp_id: "", loading: false });
      });
  };

  clearTemp = () => {
    this.setState({
      temp_tipoid_seg: "",
      temp_nid_seg: "",
      temp_nombre_seg: "",
      temp_apell_seg: "",
      temp_email_seg: "",
      temp_estado_seg: "",
      temp_user_seg: "",
      temp_rol_seg: "",
      temp_pass_seg: "",
      temp_passcon_seg: "",
    });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_tipoid_seg":
        this.setState({ temp_tipoid_seg: value });
        break;
      case "input_nid_seg":
        this.setState({ temp_nid_seg: value });
        break;
      case "input_nombre_seg":
        this.setState({ temp_nombre_seg: value });
        break;
      case "input_apell_seg":
        this.setState({ temp_apell_seg: value });
        break;
      case "input_email_seg":
        this.setState({ temp_email_seg: value });
        break;
      case "input_estado_seg":
        this.setState({ temp_estado_seg: value });
        break;
      case "input_user_seg":
        this.setState({ temp_user_seg: value });
        break;
      case "input_pass_seg":
        this.setState({ temp_pass_seg: value });
        break;
      case "input_passcon_seg":
        this.setState({ temp_passcon_seg: value });
        break;
      case "input_rol_seg":
        this.setState({ temp_rol_seg: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE = this.state.box_size;
    const BOX_SIZE_BIG = this.state.box_sizeBig;
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">
            Registro y edición de usuarios
          </h3>
          <h4 className="o-contentTittle-sub">
            todos los campos son obligatorios
          </h4>
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
          <div className="o-contentForm-parametros30per">
            <TableContainer
              className="o-tableBase-consultas"
              style={{ display: "inline", height: BOX_SIZE, marginTop: "1rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Usuarios existentes</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_users_seg.map((obj, i) => (
                    <TableRow
                      key={i}
                      hover={true}
                      selected={this.state.temp_id === obj.id}
                    >
                      <StyledTableCell size="small">
                        {obj.usuario}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            className="o-tinyBtn"
                            color="inherit"
                            style={{ color: "#47B14C" }}
                            onClick={() => {
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_accion: "e",
                                  loading: true,
                                  temp_color: "#3e3e3e",
                                },
                                this.callApiGet
                              );
                            }}
                          >
                            <IconEdit />
                          </IconButton>
                          <IconButton
                            disabled={this.props.userName === obj.usuario}
                            size="small"
                            color="secondary"
                            onClick={() =>
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_accion: "",
                                  temp_color: "#bdbdbd",
                                  delDato: true,
                                },
                                this.clearTemp
                              )
                            }
                          >
                            <IconDelete />
                          </IconButton>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.api_users_seg[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="o-btnAnadirTable">
              <BlueButton
                disabled={this.state.temp_accion === "e"}
                onClick={() =>
                  this.setState(
                    { temp_id: "", temp_color: "#303f9f", temp_accion: "a" },
                    this.handleClickOpen
                  )
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
          <div className="o-contentForm-parametros60per">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                height: BOX_SIZE_BIG,
                justifyContent: "space-evenly",
                marginTop: "1rem",
                paddingTop: "3rem",
                border: "1px solid" + this.state.temp_color,
                borderRadius: "5px",
                position: "relative",
              }}
            >
              <div className="o-contentFormDiag">
                <div style={{ marginBottom: BOX_SPACING }}>
                  <div className="o-dobleInput">
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      className="o-selectShort"
                      disabled={this.state.temp_accion === ""}
                    >
                      <InputLabel>ID</InputLabel>
                      <Select
                        value={this.state.temp_tipoid_seg || ""}
                        onChange={this.handleChange}
                        label="ID"
                        name="input_tipoid_seg"
                      >
                        {this.state.api_tipoid_seg.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className="o-inputShort">
                      <TextField
                        disabled={this.state.temp_accion === ""}
                        label="Número"
                        variant="outlined"
                        value={this.state.temp_nid_seg || ""}
                        name="input_nid_seg"
                        onChange={this.handleChange}
                        className="o-space"
                        margin="dense"
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    disabled={this.state.temp_accion === ""}
                    label="Nombres"
                    variant="outlined"
                    name="input_nombre_seg"
                    value={this.state.temp_nombre_seg || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    disabled={this.state.temp_accion === ""}
                    label="Apellidos"
                    variant="outlined"
                    name="input_apell_seg"
                    value={this.state.temp_apell_seg || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    disabled={this.state.temp_accion === ""}
                    label="Correo"
                    variant="outlined"
                    name="input_email_seg"
                    value={this.state.temp_email_seg || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  disabled={this.state.temp_accion === ""}
                >
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={this.state.temp_estado_seg}
                    onChange={this.handleChange}
                    label="Estado"
                    name="input_estado_seg"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.api_estado_seg.map((obj, i) => {
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
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    disabled={this.state.temp_accion === ""}
                    label="Nombre de usuario"
                    variant="outlined"
                    name="input_user_seg"
                    value={this.state.temp_user_seg || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                {this.state.temp_accion === "e" ? (
                  <div style={{ fontSize: "0.8rem", color: "#f00" }}>
                    Ingresar una contraseña eliminará la anterior
                  </div>
                ) : null}
                <FormControl
                  variant="outlined"
                  margin="dense"
                  disabled={this.state.temp_accion === ""}
                >
                  <InputLabel>Contraseña</InputLabel>
                  <OutlinedInput
                    type={this.state.showpass ? "text" : "password"}
                    value={this.state.temp_pass_seg || ""}
                    name="input_pass_seg"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                    onChange={this.handleChange}
                    label={"Contraseña"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disabled={this.state.temp_accion === ""}
                          size="small"
                          onClick={() =>
                            this.setState({ showpass: !this.state.showpass })
                          }
                        >
                          {this.state.showpass ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  disabled={this.state.temp_accion === ""}
                  error={
                    this.state.temp_pass_seg !== this.state.temp_passcon_seg
                  }
                >
                  <InputLabel>Confirmar contr.</InputLabel>
                  <OutlinedInput
                    type={this.state.showpasscon ? "text" : "password"}
                    value={this.state.temp_passcon_seg || ""}
                    name="input_passcon_seg"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                    onChange={this.handleChange}
                    label={"Confirmar contr."}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disabled={this.state.temp_accion === ""}
                          size="small"
                          onClick={() =>
                            this.setState({
                              showpasscon: !this.state.showpasscon,
                            })
                          }
                        >
                          {this.state.showpasscon ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {this.state.temp_pass_seg !== this.state.temp_passcon_seg ? (
                    <FormHelperText>
                      Las contraseñas no coinciden
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  disabled={this.state.temp_accion === ""}
                >
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={this.state.temp_rol_seg}
                    onChange={this.handleChange}
                    label="Rol"
                    name="input_rol_seg"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.api_rol_seg.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "14.5rem",
                  position: "absolute",
                  right: "1rem",
                  bottom: "1rem",
                }}
              >
                <div className="o-btnBotNav-btn">
                  <RedButton
                    disabled={this.state.temp_accion === ""}
                    onClick={() =>
                      this.setState(
                        { temp_accion: "", temp_id: "", temp_color: "#bdbdbd" },
                        this.clearTemp
                      )
                    }
                  >
                    {"Cancelar"}
                  </RedButton>
                </div>
                <div className="o-btnBotNav-btn">
                  <GreenButton
                    disabled={this.state.temp_accion === ""}
                    onClick={this.handleClose}
                  >
                    {"Guardar"}
                  </GreenButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={this.state.createS} maxWidth={false}>
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

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.delDato}
          onClose={() => this.setState({ delDato: false })}
          maxWidth={false}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            {"¿Desea eliminar el usuario?"}
          </DialogTitle>
          <DialogContent>
            El usuario perderá todo acceso al sistema, esta acción es
            irreversible
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <div className="o-btnBotNav-btnDiag3">
              <RedButton
                onClick={() =>
                  this.setState(
                    { loading: true, delDato: false },
                    this.callApiDel()
                  )
                }
              >
                {"Eliminar"}
              </RedButton>
            </div>
            <div className="o-btnBotNav-btnDiag3">
              <GreenButton
                onClick={() => this.setState({ delDato: false, temp_id: "" })}
              >
                {"Cancelar"}
              </GreenButton>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ControlUsuarios;
