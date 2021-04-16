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
  IconButton,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
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
      temp_titulo_tar: "",
      temp_des_tar: "",
      temp_res_tar: "",
      temp_estado_tar: "",
      estado_tar_api: props.estado_tar_api,
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
      titulo: this.state.temp_titulo_tar,
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
            temp_titulo_tar: data.tarea.titulo,
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
      temp_titulo_tar: "",
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
      case "input_titulo_tar":
        this.setState({ temp_titulo_tar: value });
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
            this.props.data.titulo +
            " " +
            this.props.data.fecha_programada}
        </div>

        <div className="o-contentForm-big-consultas">
          <TableContainer className="o-tableBase" style={{ marginTop: "1rem" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Tema</StyledTableCell>
                  <StyledTableCell>Descripción</StyledTableCell>
                  <StyledTableCell>Resultado</StyledTableCell>
                  <StyledTableCell>Estado</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.tareas.map((obj, i) => (
                  <TableRow key={i} hover={true}>
                    <StyledTableCell size="small">{obj.titulo}</StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.descripcion}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.resultado === null ? "Sin realizar" : obj.resultado}
                    </StyledTableCell>
                    <StyledTableCell size="small">{obj.nombre}</StyledTableCell>
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
                            {
                              temp_id_tar: obj.id,
                            },
                            this.handleClickOpenDel
                          )
                        }
                      >
                        <IconDelete />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
                {this.state.tareas[0] === undefined ? (
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
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label={
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Título"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    name="input_titulo_tar"
                    value={this.state.temp_titulo_tar || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                    error={
                      this.state.reqText && this.state.temp_titulo_tar === ""
                    }
                  />
                </div>
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
                    name="input_obs_tar"
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
                  <InputLabel id="demo-simple-select-outlined-label">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"Estado"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_estado_tar}
                    onChange={this.handleChange}
                    label="Estado*"
                    name="input_estado_tar"
                    className="o-space"
                  >
                    <MenuItem
                      disabled={true}
                      value="input_estado_tar"
                    ></MenuItem>
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
