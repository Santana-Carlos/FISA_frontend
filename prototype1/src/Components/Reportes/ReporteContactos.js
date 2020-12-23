import React, { Component } from "react";
import { saveAs } from "file-saver";
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
} from "../Buttons";
import {
  Refresh as IconRefresh,
  GetApp as IconDownload,
} from "@material-ui/icons";
import "../Styles.css";

const items = [
  {
    id: "",
    nombre: "Ninguno",
  },
  {
    id: "organizacions.nombre",
    nombre: "Organización",
  },
  {
    id: "contactos.nombres",
    nombre: "Nombres",
  },
  {
    id: "contactos.apellidos",
    nombre: "Apellidos",
  },
  {
    id: "contactos.cargo",
    nombre: "Cargo",
  },
  {
    id: "contactos.celular",
    nombre: "Celular",
  },
];

class ReporteContacto extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      createS: false,
      reqText: false,
      tipo1: "",
      tipo2: "",
      tipo3: "",
      tipo4: "",
      palabra1: "",
      palabra2: "",
      palabra3: "",
      palabra4: "",
      contacts: [],
      loading: true,
      searched: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.callAPi();
  }

  callAPi = () => {
    fetch(process.env.REACT_APP_API_URL + "Contacto", {
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
            contacts: data.contactos,
            loading: false,
            searched: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
      });
  };

  apiSearch = () => {
    this.setState({ loading: true });
    const tipo1 = this.state.tipo1;
    const tipo2 = this.state.tipo2 === "" ? tipo1 : this.state.tipo2;
    const tipo3 = this.state.tipo3 === "" ? tipo1 : this.state.tipo3;
    const tipo4 = this.state.tipo4 === "" ? tipo1 : this.state.tipo4;
    const palabra1 = this.state.palabra1 + "%";
    const palabra2 =
      this.state.palabra2 === "" ? palabra1 : this.state.palabra2 + "%";
    const palabra3 =
      this.state.palabra3 === "" ? "%" : this.state.palabra3 + "%";
    const palabra4 =
      this.state.palabra4 === "" ? "%" : this.state.palabra4 + "%";
    const data = {
      tipos: [tipo1, tipo2, tipo3, tipo4],
      palabras: [palabra1, palabra2, palabra3, palabra4],
    };
    if (tipo1 !== "" && palabra1 !== "%") {
      fetch(process.env.REACT_APP_API_URL + "Contacto/Search", {
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
              loading: false,
              contacts: data.contactos,
              reqText: false,
              searched: true,
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({ loading: false, reqText: true, createS: true });
      this.callAPi();
    }
  };

  apiRefresh = () => {
    this.setState({ loading: true });
    if (this.state.tipo1 !== "" && this.state.palabra1 !== "") {
      this.apiSearch();
    } else {
      this.callAPi();
    }
  };

  clearFunc = () => {
    this.setState(
      {
        loading: true,
        tipo1: "",
        tipo2: "",
        tipo3: "",
        tipo4: "",
        palabra1: "",
        palabra2: "",
        palabra3: "",
        palabra4: "",
        reqText: false,
      },
      this.callAPi()
    );
  };

  apiReportGen = () => {
    this.setState({ loading: true });
    fetch(process.env.REACT_APP_API_URL + "Contacto/RepGen", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        this.setState({ loading: false });
        saveAs(data, "CONTACTOS_REPORTE_GENERAL");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  apiReportBus = () => {
    this.setState({ loading: true });
    const contactsList = this.state.contacts;
    const contactsIdList =
      contactsList[0] !== undefined ? contactsList.map((obj) => obj.id) : [];
    const data = {
      ids: contactsIdList,
    };

    fetch(process.env.REACT_APP_API_URL + "Contacto/RepBus", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        this.setState({ loading: false });
        saveAs(data, "CONTACTOS_REPORTE");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;
    let checked = event.target.checked;

    switch (name) {
      case "input_tipo1":
        this.setState({ tipo1: value });
        if (value === "") {
          this.setState({ palabra1: "" });
        }
        break;
      case "input_tipo2":
        this.setState({ tipo2: value });
        if (value === "") {
          this.setState({ palabra2: "" });
        }
        break;
      case "input_tipo3":
        this.setState({ tipo3: value });
        if (value === "") {
          this.setState({ palabra3: "" });
        }
        break;
      case "input_tipo4":
        this.setState({ tipo4: value });
        if (value === "") {
          this.setState({ palabra4: "" });
        }
        break;
      case "input_palabra1":
        this.setState({ palabra1: value });
        break;
      case "input_palabra2":
        this.setState({ palabra2: value });
        break;
      case "input_palabra3":
        this.setState({ palabra3: value });
        break;
      case "input_palabra4":
        this.setState({ palabra4: value });
        break;
      case "input_delcheck":
        this.setState({ delcheck: checked });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = window.innerHeight > 900 ? "0.6rem" : "0.2rem";
    const BOX_SIZE = window.innerHeight > 900 ? "32rem" : "16.5rem";
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3
            className="o-contentTittle-principal"
            style={{ marginTop: "0.2rem" }}
          >
            {"Generar reporte de contactos"}
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
          <div className="o-consultas-containerInit">
            <div className="o-consultas">
              <FormControl
                variant="outlined"
                margin="dense"
                error={this.state.reqText && this.state.tipo1 === ""}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Añadir*
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.tipo1 || ""}
                  onChange={this.handleChange}
                  label="Añadir*"
                  name="input_tipo1"
                  className="o-space"
                  style={{ marginBottom: BOX_SPACING }}
                >
                  <MenuItem disabled={true} value="input_tipo1"></MenuItem>
                  {items.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj.id}>
                        {obj.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="o-consultas" style={{ marginRight: "2rem" }}>
              <TextField
                label="Buscar*"
                variant="outlined"
                name="input_palabra1"
                value={this.state.palabra1 || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
                error={this.state.reqText && this.state.palabra1 === ""}
              />
            </div>
            <div className="o-consultas">
              <FormControl variant="outlined" margin="dense">
                <InputLabel id="demo-simple-select-outlined-label">
                  Filtrar
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.tipo3 || ""}
                  onChange={this.handleChange}
                  label="Filtrar"
                  name="input_tipo3"
                  className="o-space"
                  style={{ marginBottom: BOX_SPACING }}
                >
                  <MenuItem disabled={true} value="input_tipo3"></MenuItem>
                  {items.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj.id}>
                        {obj.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="o-consultas">
              <TextField
                label="Buscar"
                variant="outlined"
                name="input_palabra3"
                value={this.state.palabra3 || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
          </div>
          <div className="o-consultas-containerInit">
            <div className="o-consultas">
              <FormControl variant="outlined" margin="dense">
                <InputLabel id="demo-simple-select-outlined-label">
                  Añadir
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.tipo2 || ""}
                  onChange={this.handleChange}
                  label="Añadir"
                  name="input_tipo2"
                  className="o-space"
                  style={{ marginBottom: BOX_SPACING }}
                >
                  <MenuItem disabled={true} value="input_tipo2"></MenuItem>
                  {items.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj.id}>
                        {obj.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="o-consultas" style={{ marginRight: "2rem" }}>
              <TextField
                label="Buscar"
                variant="outlined"
                name="input_palabra2"
                value={this.state.palabra2 || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div className="o-consultas">
              <FormControl variant="outlined" margin="dense">
                <InputLabel id="demo-simple-select-outlined-label">
                  Filtrar
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.tipo4}
                  onChange={this.handleChange}
                  label="Filtrar"
                  name="input_tipo4"
                  className="o-space"
                  style={{ marginBottom: BOX_SPACING }}
                >
                  <MenuItem disabled={true} value="input_tipo4"></MenuItem>
                  {items.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj.id}>
                        {obj.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="o-consultas">
              <TextField
                label="Buscar"
                variant="outlined"
                name="input_palabra4"
                value={this.state.palabra4 || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
          </div>
          <div className="o-consultas-container">
            <div className="o-consultas-btn">
              <div className="o-btnConsultas">
                <BlueButton onClick={this.apiSearch}>Buscar</BlueButton>
              </div>
              <div className="o-btnConsultas">
                <RedButton onClick={this.clearFunc}>Limpiar</RedButton>
              </div>
              <div className="o-btnConsultas" style={{ width: "4rem" }}>
                <BlueButton onClick={this.apiRefresh}>
                  <IconRefresh size="small" />
                </BlueButton>
              </div>
              <div
                className="o-btnConsultas"
                style={{ width: "8rem", marginLeft: "auto" }}
              >
                <GreenButton
                  onClick={
                    this.state.searched ? this.apiReportBus : this.apiReportGen
                  }
                >
                  Reporte
                  <IconDownload style={{ marginLeft: "0.4rem" }} size="small" />
                </GreenButton>
              </div>
            </div>
          </div>
          <TableContainer
            className="o-tableBase-consultas"
            style={{ maxHeight: BOX_SIZE }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Organización</StyledTableCell>
                  <StyledTableCell>Nombre</StyledTableCell>
                  <StyledTableCell>Cargo</StyledTableCell>
                  <StyledTableCell>Correo</StyledTableCell>
                  <StyledTableCell>Celular</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.contacts.map((obj, i) => (
                  <TableRow key={i} hover={true}>
                    <StyledTableCell size="small">
                      {obj.organizacion}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.nombres + " " + obj.apellidos}
                    </StyledTableCell>
                    <StyledTableCell size="small">{obj.cargo}</StyledTableCell>
                    <StyledTableCell size="small">{obj.email}</StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.celular}
                    </StyledTableCell>
                  </TableRow>
                ))}
                {this.state.contacts[0] === undefined ? (
                  <TableRow>
                    <StyledTableCell>...</StyledTableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Dialog open={this.state.createS} maxWidth={false}>
          <DialogTitle style={{ textAlign: "center" }}>
            {"No se pudo buscar"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            {
              "(Para realizar una busqueda debe ingresar al menos el primer parametro)"
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

export default ReporteContacto;
