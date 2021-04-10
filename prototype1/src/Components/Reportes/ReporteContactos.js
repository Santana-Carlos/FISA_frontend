import React, { Component } from "react";
import { saveAs } from "file-saver";
import {
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
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
  "personas.nombres",
  "personas.apellidos",
  "organizacions.nombre",
  "contactos.cargo",
  "contactos.email",
  "pais.id",
  "organizacions.categoria_id",
  "detalle_categoria_personas.subcategoria_id",
];

const emptyCell = "-";

class ReporteContacto extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      createS: false,
      reqText: false,
      contacts: [],
      nombre_org: "",
      nombre_con: "",
      apell_con: "",
      cargo_con: "",
      correo_con: "",
      pais_ofi: "",
      cat_org: [],
      subcat_con: [],
      pais_ofi_api: [],
      cat_org_api: [],
      subcat_con_api: [],
      loading: true,
      searched: false,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "32rem" : "16.5rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "32rem" : "16.5rem",
    });
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "Organizacion/Data", {
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
          pais_ofi_api: data.paises,
          cat_org_api: data.categorias,
        });
      })
      .catch((error) => {});
    fetch(process.env.REACT_APP_API_URL + "Contacto/Data", {
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
          subcat_con_api: data.subcategorias,
        });
      })
      .catch((error) => {});
    this.callAPi();
    this.setState({
      winInterval: window.setInterval(this.resizeBox, 1000),
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.winInterval);
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
    const nombreOrg = this.state.nombre_org + "%";
    const nombreCon = this.state.nombre_con + "%";
    const apellCon = this.state.apell_con + "%";
    const cargo =
      this.state.cargo_con === "" ? "%" : this.state.cargo_con + "%";
    const email =
      this.state.correo_con === "" ? "%" : this.state.correo_con + "%";
    const pais = this.state.pais_ofi === "" ? "%" : this.state.pais_ofi;
    const categoria =
      this.state.cat_org[0] === undefined
        ? this.state.cat_org_api.map((obj) => obj.id)
        : this.state.cat_org.map((obj) => obj.id);
    const subcat =
      this.state.subcat_con[0] === undefined
        ? categoria
        : this.state.subcat_con.map((obj) => obj.id);

    const palabra1 = items[0];
    const palabra2 = items[1];
    const palabra3 = items[2];
    const palabra4 = this.state.cargo_con === "" ? items[0] : items[3];
    const palabra5 = this.state.correo_con === "" ? items[0] : items[4];
    const palabra6 = this.state.pais_ofi === "" ? items[0] : items[5];
    const palabra7 = items[6];
    const palabra8 =
      this.state.subcat_con[0] === undefined ? items[6] : items[7];
    const palabra9 = this.state.pais_ofi === "" ? "ilike" : "=";

    const data = {
      nombres: nombreCon,
      apellidos: apellCon,
      organizacion: nombreOrg,
      cargo: cargo,
      email: email,
      pais: pais,
      categorias: categoria,
      subcategorias: subcat,
      parametros: [
        palabra1,
        palabra2,
        palabra3,
        palabra4,
        palabra5,
        palabra6,
        palabra7,
        palabra8,
        palabra9,
      ],
    };

    //console.log(data);
    if (
      this.state.nombre_org !== "" ||
      this.state.nombre_con !== "" ||
      this.state.apell_con !== "" ||
      this.state.cargo_con !== "" ||
      this.state.correo_con !== "" ||
      this.state.pais_ofi !== "" ||
      this.state.cat_org[0] !== undefined ||
      this.state.subcat_con[0] !== undefined
    ) {
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
    if (
      this.state.nombre_org !== "" ||
      this.state.nombre_con !== "" ||
      this.state.apell_con !== "" ||
      this.state.cargo_con !== "" ||
      this.state.correo_con !== "" ||
      this.state.pais_ofi !== "" ||
      this.state.cat_org[0] !== undefined ||
      this.state.subcat_con[0] !== undefined
    ) {
      this.apiSearch();
    } else {
      this.callAPi();
    }
  };

  clearFunc = () => {
    this.setState(
      {
        loading: true,
        nombre_org: "",
        nombre_con: "",
        apell_con: "",
        cargo_con: "",
        correo_con: "",
        pais_ofi: "",
        cat_org: [],
        subcat_con: [],
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
      contactsList[0] !== undefined
        ? contactsList.map((obj) => obj.contacto_id)
        : [];
    const data = {
      ids: contactsIdList,
    };

    fetch(process.env.REACT_APP_API_URL + "Contacto/RepBus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    switch (name) {
      case "input_nombre_org":
        this.setState({ nombre_org: value });
        break;
      case "input_nombre_con":
        this.setState({ nombre_con: value });
        break;
      case "input_apell_con":
        this.setState({ apell_con: value });
        break;
      case "input_cargo_con":
        this.setState({ cargo_con: value });
        break;
      case "input_correo_con":
        this.setState({ correo_con: value });
        break;
      case "input_pais_ofi":
        this.setState({ pais_ofi: value });
        break;
      case "input_cat_org":
        this.setState({ cat_org: value });
        break;
      case "input_subcat_con":
        this.setState({ subcat_con: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE = this.state.box_size;
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
            <div className="o-consultas" style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Organización"
                variant="outlined"
                name="input_nombre_org"
                value={this.state.nombre_org || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div className="o-consultas" style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Nombres"
                variant="outlined"
                name="input_nombre_con"
                value={this.state.nombre_con || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div className="o-consultas" style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Apellidos"
                variant="outlined"
                name="input_apell_con"
                value={this.state.apell_con || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div
              className="o-consultas"
              style={{ marginRight: 0, marginBottom: BOX_SPACING }}
            >
              <TextField
                label="Cargo"
                variant="outlined"
                name="input_cargo_con"
                value={this.state.cargo_con || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
          </div>
          <div className="o-consultas-containerInit">
            <div className="o-consultas">
              <TextField
                label="Correo"
                variant="outlined"
                name="input_correo_con"
                value={this.state.correo_con || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <FormControl
              className="o-consultas"
              style={{ marginTop: "0.8rem", marginRight: "1rem" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel id="demo-simple-select-outlined-label">
                País
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.pais_ofi || ""}
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
              className="o-consultas"
              style={{ marginTop: "0.8rem", marginRight: "1rem" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel id="demo-mutiple-checkbox-label">
                Categoría Org.
              </InputLabel>
              <Select
                id="demo-mutiple-checkbox"
                multiple
                label="Categoría Org."
                name="input_cat_org"
                className="o-space"
                value={this.state.cat_org || []}
                onChange={this.handleChange}
                MenuProps={{
                  getContentAnchorEl: () => null,
                }}
                renderValue={(selected) =>
                  selected.map((value) => value.nombre + ", ")
                }
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.cat_org_api.map((obj, i) => (
                  <MenuItem key={i} value={obj}>
                    <Checkbox
                      checked={
                        this.state.cat_org.findIndex((x) => x.id === obj.id) >
                        -1
                      }
                    />
                    <ListItemText primary={obj.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              className="o-consultas"
              style={{ marginTop: "0.8rem", marginRight: 0 }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel id="demo-mutiple-checkbox-label">
                Subcategoría
              </InputLabel>
              <Select
                id="demo-mutiple-checkbox"
                multiple
                label="Subcategoría"
                name="input_subcat_con"
                className="o-space"
                value={this.state.subcat_con || []}
                onChange={this.handleChange}
                MenuProps={{
                  getContentAnchorEl: () => null,
                }}
                renderValue={(selected) =>
                  selected.map((value) => value.nombre + ", ")
                }
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.subcat_con_api.map((obj, i) => (
                  <MenuItem key={i} value={obj}>
                    <Checkbox
                      checked={
                        this.state.subcat_con.findIndex(
                          (x) => x.id === obj.id
                        ) > -1
                      }
                    />
                    <ListItemText primary={obj.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                style={{ width: "8rem", marginLeft: "auto", marginRight: 0 }}
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
                  <StyledTableCell>Org.</StyledTableCell>
                  <StyledTableCell>Nombre</StyledTableCell>
                  <StyledTableCell>Cargo</StyledTableCell>
                  <StyledTableCell>Teléfono</StyledTableCell>
                  <StyledTableCell>Ext.</StyledTableCell>
                  <StyledTableCell>Celular</StyledTableCell>
                  <StyledTableCell>Correo</StyledTableCell>
                  <StyledTableCell>Obser.</StyledTableCell>
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
                    <StyledTableCell size="small">
                      {obj.cargo === null ? emptyCell : obj.cargo}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.telefono === null ? emptyCell : obj.telefono}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.extension === null ? emptyCell : obj.extension}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.celular === null ? emptyCell : obj.celular}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.email === null ? emptyCell : obj.email}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {obj.observaciones === null
                        ? emptyCell
                        : obj.observaciones}
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
