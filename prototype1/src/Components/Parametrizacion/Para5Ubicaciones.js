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
  ZoomIn as IconSelect,
} from "@material-ui/icons";
import "../Styles.css";

class Para5Ubicaciones extends Component {
  constructor(props) {
    super();
    this.state = {
      temp_tipo: "",
      temp_id: "",
      temp_idPais: "",
      temp_idEst: "",
      temp_dato: "",
      temp_accion: "",
      addDato: false,
      delDato: false,
      api_pais: [],
      api_estado: [],
      api_ciudad: [],
      loading: true,
      loadingDiag: false,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_sizeBig: window.innerHeight > 900 ? "45.45rem" : "27.45rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
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
    fetch(process.env.REACT_APP_API_URL + "Pais", {
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
            api_pais: data.paises,
            temp_idEst: "",
            temp_idPais: "",
            api_estado: [],
            api_ciudad: [],
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiGetEst = () => {
    const data = {
      pais_id: this.state.temp_idPais,
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
        if (data.success) {
          this.setState({
            temp_idEst: "",
            api_estado: data.estados,
            api_ciudad: [],
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiGetCiu = () => {
    const data = {
      departamento_estado_id: this.state.temp_idEst,
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
        if (data.success) {
          this.setState({
            api_ciudad: data.ciudades,
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
            case "Pais":
              this.setState({
                temp_dato: data.pais.nombre,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "DepartamentoEstado":
              this.setState({
                temp_dato: data.departamento.nombre,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "Ciudad":
              this.setState({
                temp_dato: data.ciudad.nombre,
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
      pais_id: this.state.temp_idPais,
      departamento_estado_id: this.state.temp_idEst,
    };

    console.log(data);
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
          switch (tipo) {
            case "Pais":
              this.setState(
                {
                  temp_dato: "",
                  addDato: false,
                  loadingDiag: false,
                  loading: true,
                },
                this.callApi()
              );
              break;
            case "DepartamentoEstado":
              this.setState(
                {
                  temp_dato: "",
                  addDato: false,
                  loadingDiag: false,
                  loading: true,
                },
                this.callApiGetEst()
              );
              break;
            case "Ciudad":
              this.setState(
                {
                  temp_dato: "",
                  addDato: false,
                  loadingDiag: false,
                  loading: true,
                },
                this.callApiGetCiu()
              );
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          temp_dato: "",
          addDato: false,
          loadingDiag: false,
        });
      });

    setTimeout(this.callApiRefresh, 2000);
    setTimeout(this.callApiRefresh, 5000);
  };

  callApiEdit = () => {
    this.setState({ loadingDiag: true });
    const tipo = this.state.temp_tipo;
    const id = this.state.temp_id;
    const data = {
      nombre: this.state.temp_dato,
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
          switch (tipo) {
            case "Pais":
              this.setState(
                {
                  temp_dato: "",
                  addDato: false,
                  loadingDiag: false,
                  loading: true,
                },
                this.callApi()
              );
              break;
            case "DepartamentoEstado":
              this.setState(
                {
                  temp_dato: "",
                  addDato: false,
                  loadingDiag: false,
                  loading: true,
                },
                this.callApiGetEst()
              );
              break;
            case "Ciudad":
              this.setState(
                {
                  temp_dato: "",
                  addDato: false,
                  loadingDiag: false,
                  loading: true,
                },
                this.callApiGetCiu()
              );
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        this.setState({
          temp_dato: "",
          addDato: false,
          loadingDiag: false,
        });
      });
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
          switch (tipo) {
            case "Pais":
              this.setState(
                {
                  temp_dato: "",
                  loading: true,
                },
                this.callApi()
              );
              break;
            case "DepartamentoEstado":
              this.setState(
                {
                  temp_dato: "",
                  loading: true,
                },
                this.callApiGetEst()
              );
              break;
            case "Ciudad":
              this.setState(
                {
                  temp_dato: "",
                  loading: true,
                },
                this.callApiGetCiu()
              );
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {});

    // switch (tipo) {
    //   case "Pais":
    //     setTimeout(this.callApi, 2000);
    //     setTimeout(this.callApi, 5000);
    //     break;
    //   case "DepartamentoEstado":
    //     setTimeout(this.callApiGetEst, 2000);
    //     setTimeout(this.callApiGetEst, 5000);
    //     break;
    //   case "Ciudad":
    //     setTimeout(this.callApiGetCiu, 2000);
    //     setTimeout(this.callApiGetCiu, 5000);
    //     break;
    //   default:
    //     break;
    // }
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_temp_dato":
        this.setState({ temp_dato: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE_BIG = this.state.box_sizeBig;
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3
            className="o-contentTittle-principal"
            style={{ marginTop: "0.2rem" }}
          >
            Parámetros de Ubicación
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
          <div className="o-contentForm-parametros30per">
            <TableContainer
              className="o-tableBase-consultas"
              style={{ height: BOX_SIZE_BIG, marginTop: "0.5rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Países</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        className="o-tinyBtn"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "Pais",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_pais.map((obj, i) => (
                    <TableRow
                      key={i}
                      hover={true}
                      selected={obj.id === this.state.temp_idPais}
                    >
                      <StyledTableCell size="small">
                        {obj.nombre}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              this.setState(
                                {
                                  temp_idPais: obj.id,
                                  loading: true,
                                },
                                this.callApiGetEst
                              );
                            }}
                          >
                            <IconSelect />
                          </IconButton>
                          <IconButton
                            size="small"
                            className="o-tinyBtn"
                            style={{ color: "#47B14C" }}
                            onClick={() => {
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_tipo: "Pais",
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
                                temp_tipo: "Pais",
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
                  {this.state.api_pais[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="o-contentForm-parametros30per">
            {this.state.temp_idPais === "" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "gray",
                  width: "100%",
                  height: BOX_SIZE_BIG,
                  marginTop: "0.5rem",
                  border: "1px solid #3e3e3e",
                  borderRadius: "5px",
                }}
              >
                <div style={{ fontSize: "1.2rem", margin: "3rem auto 0.5rem" }}>
                  {"Departamentos/Estados"}
                </div>
                <div style={{ margin: "0 auto" }}>{"(Selecciona un País)"}</div>
              </div>
            ) : (
              <TableContainer
                className="o-tableBase-consultas"
                style={{ height: BOX_SIZE_BIG, marginTop: "0.5rem" }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Estados/Dep.</StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton
                          size="small"
                          style={{ color: "#ffffff", marginRight: 0 }}
                          onClick={() =>
                            this.setState({
                              addDato: true,
                              temp_accion: "a",
                              temp_tipo: "DepartamentoEstado",
                            })
                          }
                        >
                          <IconAdd />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.api_estado.map((obj, i) => (
                      <TableRow
                        key={i}
                        hover={true}
                        selected={obj.id === this.state.temp_idEst}
                      >
                        <StyledTableCell size="small">
                          {obj.nombre}
                        </StyledTableCell>
                        <StyledTableCell size="small" align="right">
                          <div className="o-row-btnIcon">
                            <IconButton
                              size="small"
                              className="o-tinyBtn"
                              color="primary"
                              onClick={() => {
                                this.setState(
                                  {
                                    temp_idEst: obj.id,
                                    loading: true,
                                  },
                                  this.callApiGetCiu
                                );
                              }}
                            >
                              <IconSelect />
                            </IconButton>
                            <IconButton
                              size="small"
                              className="o-tinyBtn"
                              style={{ color: "#47B14C" }}
                              onClick={() => {
                                this.setState(
                                  {
                                    temp_id: obj.id,
                                    temp_tipo: "DepartamentoEstado",
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
                                  temp_tipo: "DepartamentoEstado",
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
                    {this.state.api_estado[0] === undefined ? (
                      <TableRow>
                        <StyledTableCell>...</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>

          <div className="o-contentForm-parametros30per">
            {this.state.temp_idEst === "" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "gray",
                  width: "100%",
                  height: BOX_SIZE_BIG,
                  marginTop: "0.5rem",
                  border: "1px solid #3e3e3e",
                  borderRadius: "5px",
                }}
              >
                <div style={{ fontSize: "1.2rem", margin: "3rem auto 0.5rem" }}>
                  {"Ciudades"}
                </div>
                <div style={{ margin: "0 auto" }}>
                  {"(Selecciona un Departamento/Estado)"}
                </div>
              </div>
            ) : (
              <TableContainer
                className="o-tableBase-consultas"
                style={{ height: BOX_SIZE_BIG, marginTop: "0.5rem" }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Ciudades</StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton
                          size="small"
                          style={{ color: "#ffffff", marginRight: 0 }}
                          onClick={() =>
                            this.setState({
                              addDato: true,
                              temp_accion: "a",
                              temp_tipo: "Ciudad",
                            })
                          }
                        >
                          <IconAdd />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.api_ciudad.map((obj, i) => (
                      <TableRow key={i} hover={true}>
                        <StyledTableCell size="small">
                          {obj.nombre}
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
                                    temp_tipo: "Ciudad",
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
                                  temp_tipo: "Ciudad",
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
                    {this.state.api_ciudad[0] === undefined ? (
                      <TableRow>
                        <StyledTableCell>...</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
                  id="outlined-textarea"
                  label="Nombre"
                  value={this.state.temp_dato || ""}
                  variant="outlined"
                  name="input_temp_dato"
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

export default Para5Ubicaciones;
