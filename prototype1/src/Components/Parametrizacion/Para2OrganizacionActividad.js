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
  StyledTableCell as StyledTableCellBig,
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

class Para2OrganizacionActividad extends Component {
  constructor(props) {
    super();
    this.state = {
      temp_tipo: "",
      temp_id: "",
      temp_idSec: "",
      temp_dato: "",
      temp_datosDesc: "",
      temp_accion: "",
      addDato: false,
      addCiiu: false,
      delDato: false,
      api_ciiu: [],
      api_sec: [],
      api_sub: [],
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
    fetch(process.env.REACT_APP_API_URL + "Administracion/Actividad", {
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
            api_sec: data.sectores,
            api_ciiu: data.ciius,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiRefresh = () => {
    const tipo = this.state.temp_tipo;

    fetch(process.env.REACT_APP_API_URL + tipo, {
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
            case "Sector":
              this.setState({
                api_sec: data.sectores,
                temp_idSec: "",
                api_sub: [],
                loading: false,
              });
              break;
            case "Ciiu":
              this.setState({
                api_ciiu: data.ciius,
                loading: false,
              });
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiGetSub = () => {
    const idSec = this.state.temp_idSec;
    const data = {
      sector_id: idSec,
    };

    fetch(process.env.REACT_APP_API_URL + "Subsector/Sector", {
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
            api_sub: data.subsectores,
            loading: false,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          loading: false,
        });
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
        //console.log(data);
        if (data.success) {
          switch (tipo) {
            case "Sector":
              this.setState({
                temp_dato: data.sector.nombre,
                temp_datosDesc: data.sector.descripcion,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "Subsector":
              this.setState({
                temp_dato: data.subsector.nombre,
                temp_datosDesc: data.subsector.descripcion,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "Ciiu":
              this.setState({
                temp_dato: data.ciius.codigo,
                temp_datosDesc: data.ciius.nombre,
                addCiiu: true,
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
    const idSec = this.state.temp_idSec;
    let data = {};

    switch (tipo) {
      case "Sector":
        data = {
          descripcion: this.state.temp_datosDesc,
          nombre: this.state.temp_dato,
        };
        break;
      case "Subsector":
        data = {
          sector_id: idSec,
          nombre: this.state.temp_dato,
          descripcion: this.state.temp_datosDesc,
        };
        break;
      case "Ciiu":
        data = {
          codigo: this.state.temp_dato,
          nombre: this.state.temp_datosDesc,
        };
        break;
      default:
        break;
    }

    //console.log(JSON.stringify(data));
    fetch(process.env.REACT_APP_API_URL + tipo, {
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
              addDato: false,
              addCiiu: false,
              loadingDiag: false,
              loading: true,
            },
            () => {
              if (tipo === "Subsector") {
                this.callApiGetSub();
              } else {
                this.callApiRefresh();
              }
            }
          );
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          temp_dato: "",
          temp_datosDesc: "",
          addDato: false,
          addCiiu: false,
          loadingDiag: false,
        });
      });

    if (tipo === "Subsector") {
      setTimeout(this.callApiGetSub, 2000);
      setTimeout(this.callApiGetSub, 5000);
    } else {
      setTimeout(this.callApiRefresh, 2000);
      setTimeout(this.callApiRefresh, 5000);
    }
  };

  callApiEdit = () => {
    this.setState({ loadingDiag: true });
    const tipo = this.state.temp_tipo;
    const id = this.state.temp_id;
    let data = {};

    switch (tipo) {
      case "Sector":
        data = {
          nombre: this.state.temp_dato,
          descripcion: this.state.temp_datosDesc,
        };
        break;
      case "Subsector":
        data = {
          nombre: this.state.temp_dato,
          descripcion: this.state.temp_datosDesc,
        };
        break;
      case "Ciiu":
        data = {
          codigo: this.state.temp_dato,
          nombre: this.state.temp_datosDesc,
        };
        break;
      default:
        break;
    }
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
              addDato: false,
              addCiiu: false,
              loadingDiag: false,
              loading: true,
            },
            () => {
              if (tipo === "Subsector") {
                this.callApiGetSub();
              } else {
                this.callApiRefresh();
              }
            }
          );
        }
      })
      .catch((error) => {
        this.setState({
          temp_dato: "",
          temp_datosDesc: "",
          addDato: false,
          addCiiu: false,
          loadingDiag: false,
        });
      });

    if (tipo === "Subsector") {
      setTimeout(this.callApiGetSub, 2000);
      setTimeout(this.callApiGetSub, 5000);
    } else {
      setTimeout(this.callApiRefresh, 2000);
      setTimeout(this.callApiRefresh, 5000);
    }
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
              temp_dato: "",
              temp_datosDesc: "",
              loading: true,
            },
            () => {
              if (tipo === "Subsector") {
                this.callApiGetSub();
              } else {
                this.callApiRefresh();
              }
            }
          );
        }
      })
      .catch((error) => {});
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
            Parámetros de Actividad Económica
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
              style={{ height: BOX_SIZE, marginTop: "0.5rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sectores Ec.</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "Sector",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_sec.map((obj, i) => (
                    <TableRow
                      key={i}
                      hover={true}
                      selected={obj.id === this.state.temp_idSec}
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
                                  temp_idSec: obj.id,
                                  loading: true,
                                },
                                this.callApiGetSub
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
                                  temp_tipo: "Sector",
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
                                temp_tipo: "Sector",
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
                  {this.state.api_sec[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>

            {this.state.temp_idSec === "" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "gray",
                  width: "100%",
                  height: BOX_SIZE,
                  marginTop: "1.3rem",
                  border: "1px solid #3e3e3e",
                  borderRadius: "5px",
                }}
              >
                <div style={{ fontSize: "1.2rem", margin: "2rem auto 0.5rem" }}>
                  {"Subsectores"}
                </div>
                <div style={{ margin: "0 auto" }}>
                  {"(Selecciona un Sector)"}
                </div>
              </div>
            ) : (
              <TableContainer
                className="o-tableBase-consultas"
                style={{ height: BOX_SIZE, marginTop: "1.3rem" }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Subsectores Ec.</StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton
                          size="small"
                          style={{ color: "#ffffff", marginRight: 0 }}
                          onClick={() =>
                            this.setState({
                              addDato: true,
                              temp_accion: "a",
                              temp_tipo: "Subsector",
                            })
                          }
                        >
                          <IconAdd />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.api_sub.map((obj, i) => (
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
                                    temp_tipo: "Subsector",
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
                                  temp_tipo: "Subsector",
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
                    {this.state.api_sub[0] === undefined ? (
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

          <div className="o-contentForm-parametros60per">
            <TableContainer
              className="o-tableBase-consultas"
              style={{ height: BOX_SIZE_BIG, marginTop: "0.5rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCellBig>CIIU</StyledTableCellBig>
                    <StyledTableCellBig>Descripción</StyledTableCellBig>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addCiiu: true,
                            temp_accion: "a",
                            temp_tipo: "Ciiu",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_ciiu.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCellBig size="small">
                        {obj.codigo}
                      </StyledTableCellBig>
                      <StyledTableCellBig size="small">
                        {obj.nombre}
                      </StyledTableCellBig>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            style={{ color: "#47B14C" }}
                            onClick={() => {
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_tipo: "Ciiu",
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
                                temp_tipo: "Ciiu",
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
                  {this.state.api_ciiu[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
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
                  label="Nombre"
                  variant="outlined"
                  value={this.state.temp_dato || ""}
                  name="input_temp_dato"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
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
          open={this.state.addCiiu}
          onClose={() => this.setState({ addCiiu: false })}
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
                  label="Código"
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
                  label="Descripción"
                  value={this.state.temp_datosDesc || ""}
                  multiline
                  rows={5}
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
                    addCiiu: false,
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

export default Para2OrganizacionActividad;
