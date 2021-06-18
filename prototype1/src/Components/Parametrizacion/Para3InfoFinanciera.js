import React, { Component } from "react";
import {
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
  GreenButton,
  RedButton,
  StyledTableCellTiny as StyledTableCell,
  StyledIconButton as IconButton,
} from "../Buttons";
import {
  Delete as IconDelete,
  Edit as IconEdit,
  AddCircle as IconAdd,
} from "@material-ui/icons";
import "../Styles.css";

class Para3InfoFinanciera extends Component {
  constructor(props) {
    super();
    this.state = {
      temp_tipo: "",
      temp_id: "",
      temp_dato: null,
      temp_datosDesc: null,
      temp_clas_cuo: null,
      temp_clas_temp: null,
      temp_accion: "",
      addDato: false,
      addClas: false,
      delDato: false,
      api_clas: [],
      api_reg: [],
      loading: true,
      loadingDiag: false,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "22rem" : "13rem",
      box_sizeBig: window.innerHeight > 900 ? "45.45rem" : "27.45rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "22rem" : "13rem",
      box_sizeBig: window.innerHeight > 900 ? "45.45rem" : "27.45rem",
    });
  };

  componentDidMount() {
    this.callApi();
    this.setState({
      winInterval: window.setInterval(this.resizeBox, 1000),
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.winInterval);
  }

  callApi = () => {
    fetch(process.env.REACT_APP_API_URL + "Administracion/InfoFinan", {
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
            api_clas: data.clasificaciones,
            api_reg: data.regimenes,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiGet = () => {
    this.setState({ loadingDiag: true });
    const tipo = this.state.temp_tipo;
    const id = this.state.temp_id;

    fetch(process.env.REACT_APP_API_URL + tipo + "/" + id, {
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
          switch (tipo) {
            case "Clasificacion":
              this.setState({
                temp_dato: data.clasificacion.nombre,
                temp_datosDesc: data.clasificacion.descripcion,
                temp_clas_cuo: data.clasificacion.cuota_anual,
                temp_clas_temp: data.clasificacion.temporada_cuota,
                addClas: true,
                loadingDiag: false,
              });
              break;
            case "Regimen":
              this.setState({
                temp_dato: data.regimen.nombre,
                temp_datosDesc: data.regimen.descripcion,
                addDato: true,
                loadingDiag: false,
              });
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        this.setState({ loadingDiag: false });
      });
  };

  handleClose = () => {
    const accion = this.state.temp_accion;
    if (this.state.temp_dato !== "") {
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
    }
  };

  callApiAdd = () => {
    this.setState({ loadingDiag: true });
    const tipo = this.state.temp_tipo;
    const data = {
      nombre: this.state.temp_dato,
      descripcion: this.state.temp_datosDesc,
      cuota_anual: this.state.temp_clas_cuo,
      temporada_cuota: this.state.temp_clas_temp,
    };
    //console.log(data);
    fetch(process.env.REACT_APP_API_URL + tipo + "/", {
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
              temp_dato: "",
              temp_datosDesc: "",
              temp_clas_cuo: "",
              temp_clas_temp: "",
              addDato: false,
              addClas: false,
              loadingDiag: false,
              loading: true,
            },
            this.callApi()
          );
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          temp_dato: "",
          temp_datosDesc: "",
          temp_clas_cuo: "",
          temp_clas_temp: "",
          addDato: false,
          addClas: false,
          loadingDiag: false,
        });
      });

    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  callApiEdit = () => {
    this.setState({ loadingDiag: true });
    const tipo = this.state.temp_tipo;
    const id = this.state.temp_id;
    const data = {
      nombre: this.state.temp_dato,
      descripcion: this.state.temp_datosDesc,
      cuota_anual: this.state.temp_clas_cuo,
      temporada_cuota: this.state.temp_clas_temp,
    };

    fetch(process.env.REACT_APP_API_URL + tipo + "/" + id, {
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
              temp_dato: "",
              temp_datosDesc: "",
              temp_clas_cuo: "",
              temp_clas_temp: "",
              addDato: false,
              addClas: false,
              loadingDiag: false,
              loading: true,
            },
            this.callApi()
          );
        }
      })
      .catch((error) => {
        this.setState({
          temp_dato: "",
          temp_datosDesc: "",
          temp_clas_cuo: "",
          temp_clas_temp: "",
          addDato: false,
          addClas: false,
          loadingDiag: false,
        });
      });

    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  callApiDel = () => {
    const tipo = this.state.temp_tipo;
    const id = this.state.temp_id;

    fetch(process.env.REACT_APP_API_URL + tipo + "/" + id, {
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
          this.setState(
            {
              loading: true,
            },
            this.callApiRefresh()
          );
        }
      })
      .catch((error) => {});

    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_temp_dato":
        this.setState({ temp_dato: value });
        break;
      case "input_temp_datosDesc":
        this.setState({ temp_datosDesc: value });
        break;
      case "input_temp_clas_cuo":
        this.setState({ temp_clas_cuo: value });
        break;
      case "input_temp_clas_temp":
        this.setState({ temp_clas_temp: value });
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
          <h3
            className="o-contentTittle-principal"
            style={{ marginTop: "0.2rem" }}
          >
            Parámetros de Información financiera
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
          <div className="o-contentForm-parametros60per">
            <TableContainer
              className="o-tableBase-consultas"
              style={{
                display: "inline",
                height: BOX_SIZE_BIG,
                marginTop: "0.5rem",
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Clasificación</StyledTableCell>
                    <StyledTableCell>Cuota Anual</StyledTableCell>
                    <StyledTableCell>Año Cuota</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addClas: true,
                            temp_accion: "a",
                            temp_tipo: "Clasificacion",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_clas.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCell size="small">
                        {obj.nombre}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.cuota_anual}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.temporada_cuota}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            className="o-tinyBtn"
                            style={{ color: "#47B14C" }}
                            onClick={() => {
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_tipo: "Clasificacion",
                                  temp_accion: "e",
                                },
                                this.callApiGet
                              );
                            }}
                          >
                            <IconEdit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              this.setState({
                                temp_tipo: "Clasificacion",
                                temp_id: obj.id,
                                delDato: true,
                              })
                            }
                          >
                            <IconDelete />
                          </IconButton>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.api_clas[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="o-contentForm-parametros30per">
            <TableContainer
              className="o-tableBase-consultas"
              style={{
                display: "inline",
                height: BOX_SIZE,
                marginTop: "0.5rem",
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Regimen</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "Regimen",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_reg.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCell size="small">
                        {obj.nombre}
                      </StyledTableCell>
                      <StyledTableCell
                        size="small"
                        style={{ paddingRight: "0.1rem" }}
                      >
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            className="o-tinyBtn"
                            style={{ color: "#47B14C" }}
                            onClick={() => {
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_tipo: "Regimen",
                                  temp_accion: "e",
                                },
                                this.callApiGet
                              );
                            }}
                          >
                            <IconEdit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              this.setState({
                                temp_tipo: "Regimen",
                                temp_id: obj.id,
                                delDato: true,
                              })
                            }
                          >
                            <IconDelete />
                          </IconButton>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.api_reg[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.addDato}
          onClose={() => this.setState({ addDato: false })}
          maxWidth={false}
        >
          <DialogTitle>
            <div className="o-row">
              <div style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                Añadir parámetro
              </div>
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
                    <CircularProgress size={"1rem"} thickness={6} />
                  </div>
                </Fade>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textDato"
                  label="Nombre"
                  value={this.state.temp_dato || ""}
                  variant="outlined"
                  name="input_temp_dato"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textDesc"
                  label="Descripción"
                  value={this.state.temp_datosDesc || ""}
                  multiline
                  rows={3}
                  variant="outlined"
                  name="input_temp_datosDesc"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="o-btnBotNav-btnDiag2">
              <RedButton
                onClick={() =>
                  this.setState({
                    addDato: false,
                    temp_id: "",
                    temp_dato: "",
                    temp_datosDesc: "",
                  })
                }
              >
                Cancelar
              </RedButton>
            </div>
            <div className="o-btnBotNav-btnDiag2">
              <GreenButton onClick={() => this.handleClose()}>
                Guardar
              </GreenButton>
            </div>
          </DialogActions>
        </Dialog>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.addClas}
          onClose={() => this.setState({ addClas: false })}
          maxWidth={false}
        >
          <DialogTitle>
            <div className="o-row">
              <div style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                Añadir parámetro
              </div>
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
                    <CircularProgress size={"1rem"} thickness={6} />
                  </div>
                </Fade>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textDato"
                  label="Nombre"
                  value={this.state.temp_dato || ""}
                  variant="outlined"
                  name="input_temp_dato"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textDesc"
                  label="Descripción"
                  value={this.state.temp_datosDesc || ""}
                  multiline
                  rows={3}
                  variant="outlined"
                  name="input_temp_datosDesc"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textCuo"
                  label="Cuota anual"
                  value={this.state.temp_clas_cuo || ""}
                  variant="outlined"
                  name="input_temp_clas_cuo"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textTemp"
                  label="Temporada cuota"
                  value={this.state.temp_clas_temp || ""}
                  variant="outlined"
                  name="input_temp_clas_temp"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="o-btnBotNav-btnDiag2">
              <RedButton
                onClick={() =>
                  this.setState({
                    addClas: false,
                    temp_id: "",
                    temp_dato: "",
                    temp_datosDesc: "",
                    temp_clas_cuo: "",
                    temp_clas_temp: "",
                  })
                }
              >
                Cancelar
              </RedButton>
            </div>
            <div className="o-btnBotNav-btnDiag2">
              <GreenButton onClick={() => this.handleClose()}>
                Guardar
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
            {"¿Desea eliminar el parámetro?"}
          </DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <div className="o-btnBotNav-btnDiag3">
              <RedButton
                onClick={() =>
                  this.setState({ delDato: false }, this.callApiDel())
                }
              >
                Eliminar
              </RedButton>
            </div>
            <div className="o-btnBotNav-btnDiag3">
              <GreenButton
                onClick={() => this.setState({ delDato: false, temp_id: "" })}
              >
                Cancelar
              </GreenButton>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Para3InfoFinanciera;
