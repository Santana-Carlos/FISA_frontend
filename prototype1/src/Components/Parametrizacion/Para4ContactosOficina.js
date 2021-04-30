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

class Para4ContactosOficina extends Component {
  constructor(props) {
    super();
    this.state = {
      temp_tipo: "",
      temp_id: "",
      temp_dato: "",
      temp_datosDesc: "",
      temp_accion: "",
      addDato: false,
      delDato: false,
      api_tipoid: [],
      api_sex: [],
      api_subcat: [],
      api_tipoofi: [],
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
    fetch(process.env.REACT_APP_API_URL + "Administracion/OfiCont", {
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
            api_tipoid: data.tipo_documentos,
            api_subcat: data.subcategorias,
            api_sex: data.sexos,
            api_tipoofi: data.tipo_oficinas,
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
            case "TipoDocumentoPersona":
              this.setState({
                api_tipoid: data.tipos,
                loading: false,
              });
              break;
            case "Subcategoria":
              this.setState({
                api_subcat: data.subcategorias,
                loading: false,
              });
              break;
            case "Sexo":
              this.setState({
                api_sex: data.sexos,
                loading: false,
              });
              break;
            case "TipoOficina":
              this.setState({
                api_tipoofi: data.tipos,
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
            case "TipoDocumentoPersona":
              this.setState({
                temp_dato: data.tipo.nombre,
                temp_datosDesc: data.tipo.descripcion,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "Subcategoria":
              this.setState({
                temp_dato: data.subcategoria.nombre,
                temp_datosDesc: data.subcategoria.descripcion,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "Sexo":
              this.setState({
                temp_dato: data.sexo.nombre,
                temp_datosDesc: data.sexo.descripcion,
                addDato: true,
                loadingDiag: false,
              });
              break;
            case "TipoOficina":
              this.setState({
                temp_dato: data.tipo.nombre,
                temp_datosDesc: data.tipo.descripcion,
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
              addDato: false,
              loadingDiag: false,
              loading: true,
            },
            this.callApiRefresh()
          );
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          temp_dato: "",
          temp_datosDesc: "",
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
      descripcion: this.state.temp_datosDesc,
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
              addDato: false,
              loadingDiag: false,
              loading: true,
            },
            this.callApiRefresh()
          );
        }
      })
      .catch((error) => {
        this.setState({
          temp_dato: "",
          temp_datosDesc: "",
          addDato: false,
          loadingDiag: false,
        });
      });

    setTimeout(this.callApiRefresh, 2000);
    setTimeout(this.callApiRefresh, 5000);
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
            this.callApiRefresh()
          );
        }
      })
      .catch((error) => {});

    setTimeout(this.callApiRefresh, 2000);
    setTimeout(this.callApiRefresh, 5000);
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
            Parámetros varios de Contactos y Oficinas
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
                    <StyledTableCell>Tipos ID</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "TipoDocumentoPersona",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_tipoid.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCell size="small">
                        {obj.descripcion === null
                          ? obj.nombre
                          : obj.nombre + " - " + obj.descripcion}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <IconButton
                          size="small"
                          style={{ color: "#47B14C" }}
                          onClick={() => {
                            this.setState(
                              {
                                temp_id: obj.id,
                                temp_tipo: "TipoDocumentoPersona",
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
                              temp_tipo: "TipoDocumentoPersona",
                              temp_id: obj.id,
                              delDato: true,
                            })
                          }
                        >
                          <IconDelete />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.api_tipoid[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer
              className="o-tableBase-consultas"
              style={{ height: BOX_SIZE, marginTop: "1.3rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sexos</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "Sexo",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_sex.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCell size="small">
                        {obj.nombre}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            style={{ color: "#47B14C" }}
                            onClick={() => {
                              this.setState(
                                {
                                  temp_id: obj.id,
                                  temp_tipo: "Sexo",
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
                                temp_tipo: "Sexo",
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
                  {this.state.api_sex[0] === undefined ? (
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
            <TableContainer
              className="o-tableBase-consultas"
              style={{ height: BOX_SIZE_BIG, marginTop: "0.5rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Subcategorías</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "Subcategoria",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_subcat.map((obj, i) => (
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
                                  temp_tipo: "Subcategoria",
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
                                temp_tipo: "Subcategoria",
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
                  {this.state.api_subcat[0] === undefined ? (
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
            <TableContainer
              className="o-tableBase-consultas"
              style={{ height: BOX_SIZE, marginTop: "0.5rem" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tipos Oficina</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        size="small"
                        style={{ color: "#ffffff", marginRight: 0 }}
                        onClick={() =>
                          this.setState({
                            addDato: true,
                            temp_accion: "a",
                            temp_tipo: "TipoOficina",
                          })
                        }
                      >
                        <IconAdd />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.api_tipoofi.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCell size="small">
                        {obj.nombre}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        {obj.nombre === "Principal" ? null : (
                          <div className="o-row-btnIcon">
                            <IconButton
                              size="small"
                              className="o-tinyBtn"
                              style={{ color: "#47B14C" }}
                              onClick={() => {
                                this.setState(
                                  {
                                    temp_id: obj.id,
                                    temp_tipo: "TipoOficina",
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
                                  temp_tipo: "TipoOficina",
                                  temp_id: obj.id,
                                  delDato: true,
                                })
                              }
                            >
                              <IconDelete />
                            </IconButton>
                          </div>
                        )}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.api_tipoofi[0] === undefined ? (
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
              <div style={{ marginBottom: BOX_SPACING }}>
                <TextField
                  id="outlined-textarea"
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

export default Para4ContactosOficina;
