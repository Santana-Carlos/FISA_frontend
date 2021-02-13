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
import { Link } from "react-router-dom";
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
  }

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
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Lista de tareas</h3>
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
                {this.state.contacts.map((obj, i) => (
                  <TableRow key={i} hover={true}>
                    <StyledTableCell size="small">{obj.titulo}</StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.descripcion}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.resultado === null ? "Sin realizar" : obj.resultado}
                    </StyledTableCell>
                    <StyledTableCell size="small">{obj.estado}</StyledTableCell>
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
          <div className="o-btnAnadirTable" style={{ width: "10rem" }}>
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
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Título"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    name="input_titulo_vis"
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
                    name="input_obs_vis"
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
                  style={{ marginTop: "auto" }}
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
                    style={{ marginBottom: 0 }}
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
      </div>
    );
  }
}

export default CrearTareas;
