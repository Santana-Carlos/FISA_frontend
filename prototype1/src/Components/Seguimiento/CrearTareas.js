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
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
  StyledIconButton as IconButton,
} from "../Buttons";
import {
  Delete as IconDelete,
  Edit as IconEdit,
  Add as IconAdd,
} from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import "../Styles.css";

class CrearTareas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      createS: false,
      reqText: false,
      tareas: [],
      temp_id_tar: "",
      temp_id_motivo_tar: "",
      temp_des_tar: "",
      temp_res_tar: "",
      temp_estado_tar: "",
      estado_tar_api: props.estado_tar_api || [],
      motivo_tar_api: props.motivo_tar_api || [],
      addTarea: false,
      delTarea: false,
      loading: true,
      loadingDiag: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.callApi();
  }

  callApi = () => {
    const data = {
      visita_id: this.props.id_vis,
    };
    fetch(process.env.REACT_APP_API_URL + "Tarea/Visita", {
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
            tareas: data.tareas,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiPostTarea = () => {
    this.setState({ loadingDiag: true });
    const idTar = this.state.temp_id_tar;
    const data = {
      visita_id: this.props.id_vis,
      motivo_id: this.state.temp_id_motivo_tar,
      descripcion: this.state.temp_des_tar,
      resultado: this.state.temp_res_tar,
      estado_id: this.state.temp_estado_tar,
    };
    // console.log(data);
    if (idTar === "") {
      fetch(process.env.REACT_APP_API_URL + "Tarea/", {
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
              loading: true,
              loadingDiag: false,
              addTarea: false,
              reqText: false,
            });
            this.clearTemp();
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
      fetch(process.env.REACT_APP_API_URL + "Tarea/" + idTar, {
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
          //console.log(data);
          if (data.success) {
            this.setState({
              loading: true,
              loadingDiag: false,
              addTarea: false,
              reqText: false,
            });
            this.clearTemp();
          }
        })
        .catch((error) => {
          this.setState({ loadingDiag: false, reqText: true, createS: true });
        });
    }
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  handleClickOpen = () => {
    const idTar = this.state.temp_id_tar;
    if (idTar !== "") {
      fetch(process.env.REACT_APP_API_URL + "Tarea/" + idTar, {
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
            temp_id_tar: data.tarea.id,
            temp_id_motivo_tar: data.tarea.motivo_id,
            temp_des_tar: data.tarea.descripcion,
            temp_res_tar: data.tarea.resultado,
            temp_estado_tar: data.tarea.estado_id,
            loadingDiag: false,
            addTarea: true,
          });
        })
        .catch((error) => {
          this.setState({ loadingDiag: false });
        });
    } else {
      this.clearTemp();
    }
    this.setState({ addTarea: true });
  };

  handleClose = (a) => {
    if (a) {
      this.callApiPostTarea();
    } else {
      this.clearTemp();
      this.setState({ addTarea: false, reqText: false });
    }
  };

  handleClickOpenDel = () => {
    this.setState({ delTarea: true });
  };

  handleCloseDel = (a) => {
    const idTar = this.state.temp_id_tar;
    if (a) {
      this.setState({ loading: true });
      fetch(process.env.REACT_APP_API_URL + "Tarea/" + idTar, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      }).catch((error) => {});
    }
    this.setState({
      delTarea: false,
      temp_id_tar: "",
    });
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  clearTemp = () => {
    this.setState({
      temp_id_tar: "",
      temp_id_motivo_tar: "",
      temp_des_tar: "",
      temp_res_tar: "",
      temp_estado_tar: "",
      reqText: false,
    });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_id_motivo":
        this.setState({ temp_id_motivo_tar: value });
        break;
      case "input_des_tar":
        this.setState({ temp_des_tar: value });
        break;
      case "input_res_tar":
        this.setState({ temp_res_tar: value });
        break;
      case "input_estado_tar":
        this.setState({ temp_estado_tar: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = this.props.box_spacing;
    const rol = this.props.rol;

    return (
      <div className="o-cardContent">
        {this.props.id_vis === "" ? (
          <Redirect exact to="/consultar_visitas" />
        ) : null}
        <div className="o-contentTittle">
          <h3
            className="o-contentTittle-principal"
            style={{ marginTop: "0.2rem" }}
          >
            Lista de tareas
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
        <div className="o-contentTittle-sub2" style={{ marginTop: "1rem" }}>
          {"Visita: " +
            this.props.name_org +
            " - " +
            this.props.data.motivo +
            " (" +
            this.props.data.fecha_programada +
            ")"}
        </div>

        <div className="o-contentForm-big-consultas">
          <TableContainer
            className="o-tableBase"
            style={{ display: "inline", marginTop: "1rem" }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Motivo</StyledTableCell>
                  <StyledTableCell>Descripción</StyledTableCell>
                  <StyledTableCell>Resultado</StyledTableCell>
                  <StyledTableCell>Estado</StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.tareas.map((obj, i) => (
                  <TableRow key={i} hover={true}>
                    <StyledTableCell size="small">{obj.motivo}</StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.descripcion}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.resultado === null ? "Sin realizar" : obj.resultado}
                    </StyledTableCell>
                    <StyledTableCell size="small">{obj.estado}</StyledTableCell>
                    {this.props.rol !== "Comercial" ? (
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            style={{ color: "#47B14C" }}
                            onClick={() =>
                              this.setState(
                                {
                                  loadingDiag: true,
                                  temp_id_tar: obj.id,
                                },
                                this.handleClickOpen
                              )
                            }
                          >
                            <IconEdit />
                          </IconButton>
                          {rol !== "Comercial" && rol !== "Consulta" ? (
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() =>
                                this.setState(
                                  {
                                    temp_id_tar: obj.id,
                                  },
                                  this.handleClickOpenDel
                                )
                              }
                            >
                              <IconDelete />
                            </IconButton>
                          ) : null}
                        </div>
                      </StyledTableCell>
                    ) : null}
                  </TableRow>
                ))}
                {this.state.tareas[0] === undefined ? (
                  <TableRow>
                    <StyledTableCell>...</StyledTableCell>
                    <StyledTableCell />
                    <StyledTableCell />
                    <StyledTableCell />
                    <StyledTableCell />
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          {rol !== "Comercial" && rol !== "Consulta" ? (
            <div className="o-btnAnadirTable">
              <BlueButton
                onClick={() =>
                  this.setState({ temp_id_tar: "" }, this.handleClickOpen)
                }
              >
                {"Añadir"}
                <IconAdd
                  style={{ marginLeft: "0.4rem", marginRight: 0 }}
                  size="small"
                />
              </BlueButton>
            </div>
          ) : null}
        </div>
        <div className="o-btnBotNav">
          <div style={{ color: "#FFFFFF" }}>{"Me encontraste!"}</div>
          <Link
            exact={"true"}
            to={"/consultar_visitas"}
            className="o-btnBotNav-btn"
          >
            <BlueButton>Finalizar</BlueButton>
          </Link>
        </div>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.addTarea}
          onClose={() => this.handleClose(false)}
          maxWidth={false}
        >
          <DialogTitle>
            <div className="o-row">
              Añadir tarea
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
                <FormControl
                  variant="outlined"
                  margin="dense"
                  style={{ maxWidth: "100%" }}
                  error={
                    this.state.reqText && this.state.temp_id_motivo_tar === ""
                  }
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"Motivo"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.temp_id_motivo_tar}
                    onChange={this.handleChange}
                    label="Motivo*"
                    name="input_id_motivo"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    {this.state.motivo_tar_api.map((obj, i) => {
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
                        {"Descripción"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    name="input_des_tar"
                    value={this.state.temp_des_tar || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                    error={this.state.reqText && this.state.temp_des_tar === ""}
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    id="outlined-textarea"
                    label="Resultado"
                    value={this.state.temp_res_tar || ""}
                    multiline
                    rows={3}
                    variant="outlined"
                    name="input_res_tar"
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
              </div>

              <div className="o-contentFormDiag">
                <FormControl
                  variant="outlined"
                  margin="dense"
                  error={
                    this.state.reqText && this.state.temp_estado_tar === ""
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
                    value={this.state.temp_estado_tar}
                    onChange={this.handleChange}
                    label="Estado*"
                    name="input_estado_tar"
                    className="o-space"
                  >
                    {this.state.estado_tar_api.map((obj, i) => {
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
                <GreenButton onClick={() => this.handleClose(true)}>
                  Guardar
                </GreenButton>
              </div>
            ) : null}
          </DialogActions>
        </Dialog>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.delTarea}
          onClose={() => this.handleCloseDel(false)}
          maxWidth={false}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            {"¿Desea eliminar la tarea?"}
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

export default CrearTareas;
