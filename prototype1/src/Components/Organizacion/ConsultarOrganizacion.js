import React, { Component } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
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
  FormControlLabel,
  Checkbox,
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
  Refresh as IconRefresh,
} from "@material-ui/icons";
import { Switch, Route } from "react-router-dom";
import OrganizacionMenu from "./OrganizacionMenu";
import "../Styles.css";

const items = [
  "organizacions.numero_documento",
  "organizacions.nombre",
  "organizacions.razon_social",
];

const emptyCell = "-";

class ConsultarOrganizacion extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      tipoid_org: "",
      nid_org: "",
      cat_org: [],
      nomcom_org: "",
      razsoc_org: "",
      createS: false,
      reqText: false,
      orgs: [],
      tipoid_org_api: [],
      cat_org_api: [],
      temp_id_org: "",
      delOrg: false,
      delcheck: false,
      delcheckOpen: false,
      loading: true,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "36rem" : "20rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "36rem" : "20rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.4rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
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
          tipoid_org_api: data.documentos,
          cat_org_api: data.categorias,
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
    fetch(process.env.REACT_APP_API_URL + "Organizacion", {
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
            orgs: data.organizaciones,
            loading: false,
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

    const numero = this.state.nid_org + "%";
    const nombre = this.state.nomcom_org + "%";
    const razon = this.state.razsoc_org + "%";
    const documento =
      this.state.tipoid_org === ""
        ? this.state.tipoid_org_api.map((obj) => obj.id)
        : [this.state.tipoid_org];
    const categoria =
      this.state.cat_org[0] === undefined
        ? this.state.cat_org_api.map((obj) => obj.id)
        : this.state.cat_org.map((obj) => obj.id);

    const palabra1 = items[0];
    const palabra2 = items[1];
    const palabra3 = this.state.razsoc_org === "" ? items[1] : items[2];

    const data = {
      numero_documento: numero,
      nombre: nombre,
      razon_social: razon,
      documentos: documento,
      categorias: categoria,
      parametros: [palabra1, palabra2, palabra3],
    };
    //console.log(data);
    if (
      this.state.nid_org !== "" ||
      this.state.nomcom_org !== "" ||
      this.state.razsoc_org !== "" ||
      this.state.tipoid_org !== "" ||
      this.state.cat_org[0] !== undefined
    ) {
      fetch(process.env.REACT_APP_API_URL + "Organizacion/Search", {
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
              orgs: data.organizaciones,
              reqText: false,
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
      this.state.nid_org !== "" ||
      this.state.nomcom_org !== "" ||
      this.state.razsoc_org !== "" ||
      this.state.tipoid_org !== "" ||
      this.state.cat_org[0] !== undefined
    ) {
      this.apiSearch();
    } else {
      this.callAPi();
    }
  };

  handleClickOpenDel = () => {
    this.setState({ delOrg: true });
  };

  handleCloseDel = (a) => {
    const idOrg = this.state.temp_id_org;
    if (a) {
      if (this.state.delcheck) {
        this.setState({ loading: true });
        fetch(process.env.REACT_APP_API_URL + "Organizacion/" + idOrg, {
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
              this.setState({
                delOrg: false,
                delcheck: false,
                temp_id_org: "",
              });
            }
          })
          .catch((error) => {});
      } else {
        this.setState({
          delcheckOpen: true,
        });
      }
    } else {
      this.setState({
        delOrg: false,
        temp_id_org: "",
      });
    }
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  editOrg = () => {
    window.location.assign(
      "/dashboard/organizacion#/consultar_organizacion/editar"
    );
  };

  clearFunc = () => {
    this.setState(
      {
        loading: true,
        tipoid_org: "",
        nid_org: "",
        nomcom_org: "",
        razsoc_org: "",
        cat_org: [],
        reqText: false,
      },
      this.callAPi()
    );
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;
    let check = event.target.checked;

    switch (name) {
      case "input_tipoid_org":
        this.setState({ tipoid_org: value, tipoid2_org: value });
        break;
      case "input_nid_org":
        this.setState({ nid_org: value });
        break;
      case "input_cat_org":
        this.setState({ cat_org: value });
        break;
      case "input_nomcom_org":
        this.setState({ nomcom_org: value });
        break;
      case "input_razsoc_org":
        this.setState({ razsoc_org: value });
        break;
      case "input_delcheck":
        this.setState({ delcheck: check });
        break;
      default:
        break;
    }
  }

  render() {
    let BOX_SPACING = this.state.box_spacing;
    let BOX_SIZE = this.state.box_size;
    return (
      <Switch>
        <Route exact path="/consultar_organizacion">
          <div className="o-cardContent">
            <div className="o-contentTittle">
              <h3
                className="o-contentTittle-principal"
                style={{ marginTop: "0.2rem" }}
              >
                Consultar organizaciones
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
                  <div style={{ marginBottom: BOX_SPACING }}>
                    <div className="o-dobleInput">
                      <FormControl
                        variant="outlined"
                        margin="dense"
                        className="o-selectShort"
                        style={{ width: "7rem" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          ID
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={this.state.tipoid_org || ""}
                          onChange={this.handleChange}
                          label="ID"
                          name="input_tipoid_org"
                        >
                          <MenuItem
                            disabled={true}
                            value="input_tipoid_org"
                          ></MenuItem>
                          <MenuItem value="">Ninguno</MenuItem>
                          {this.state.tipoid_org_api.map((obj, i) => {
                            return (
                              <MenuItem key={i} value={obj.id}>
                                {obj.nombre}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <div
                        className="o-inputShort"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        <TextField
                          label="Número"
                          variant="outlined"
                          value={this.state.nid_org || ""}
                          name="input_nid_org"
                          onChange={this.handleChange}
                          className="o-space"
                          margin="dense"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="o-consultas">
                  <TextField
                    label="Nombre comercial"
                    variant="outlined"
                    name="input_nomcom_org"
                    value={this.state.nomcom_org || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div className="o-consultas">
                  <TextField
                    label="Razón social"
                    variant="outlined"
                    name="input_razsoc_org"
                    value={this.state.razsoc_org || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <FormControl
                  className="o-consultas"
                  style={{ margin: "0.8rem 0 0" }}
                  variant="outlined"
                  margin="dense"
                >
                  <InputLabel id="demo-mutiple-checkbox-label">
                    Categoría
                  </InputLabel>
                  <Select
                    id="demo-mutiple-checkbox"
                    multiple
                    label="Categoría"
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
                            this.state.cat_org.findIndex(
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
                </div>
              </div>
              <TableContainer
                className="o-tableBase-consultas"
                style={{ maxHeight: BOX_SIZE }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Nombre</StyledTableCell>
                      <StyledTableCell>Identificación</StyledTableCell>
                      <StyledTableCell>Razón social</StyledTableCell>
                      <StyledTableCell>Categoría</StyledTableCell>
                      <StyledTableCell>Subsector</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.orgs.map((obj, i) => (
                      <TableRow key={i} hover={true}>
                        <StyledTableCell size="small">
                          {obj.nombre}
                        </StyledTableCell>
                        <StyledTableCell size="small">
                          {obj.tipo_documento_organizacion +
                            " " +
                            obj.numero_documento}
                        </StyledTableCell>
                        <StyledTableCell size="small">
                          {obj.razon_social === null
                            ? emptyCell
                            : obj.razon_social}
                        </StyledTableCell>
                        <StyledTableCell size="small">
                          {obj.categoria}
                        </StyledTableCell>
                        <StyledTableCell size="small">
                          {obj.subsector === null ? emptyCell : obj.subsector}
                        </StyledTableCell>
                        <StyledTableCell size="small" align="right">
                          <div className="o-row-btnIcon">
                            <IconButton
                              size="small"
                              style={{ color: "#47B14C" }}
                              onClick={() =>
                                this.setState(
                                  { temp_id_org: obj.id },
                                  this.editOrg
                                )
                              }
                            >
                              <IconEdit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() =>
                                this.setState(
                                  { temp_id_org: obj.id },
                                  this.handleClickOpenDel
                                )
                              }
                            >
                              <IconDelete />
                            </IconButton>
                          </div>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                    {this.state.orgs[0] === undefined ? (
                      <TableRow>
                        <StyledTableCell>...</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={this.state.delOrg}
              onClose={() => this.handleCloseDel(false)}
              maxWidth={false}
            >
              <DialogTitle style={{ textAlign: "center" }}>
                {"¿Desea eliminar la organización?"}
              </DialogTitle>
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    maxWidth: "30rem",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {
                    "Eliminar una organización también eliminará las oficinas, contactos y cualquier otra información relacionada a ella ¿Desea continuar?"
                  }
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.delcheck || false}
                        color="primary"
                        name="input_delcheck"
                        onChange={this.handleChange}
                      />
                    }
                    label="Estoy de acuerdo"
                    margin="dense"
                  />
                </div>
              </DialogContent>
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
              open={this.state.delcheckOpen}
              maxWidth={false}
              BackdropProps={{ style: { backgroundColor: "transparent" } }}
            >
              <DialogTitle style={{ textAlign: "center" }}>
                {"Eliminar organización"}
              </DialogTitle>
              <DialogContent style={{ textAlign: "center" }}>
                {
                  "Si realmente desea eliminar la organización debe marcar 'Estoy de acuerdo'"
                }
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <div className="o-btnBotNav-btnDiag3">
                  <GreenButton
                    onClick={() => this.setState({ delcheckOpen: false })}
                  >
                    {"Aceptar"}
                  </GreenButton>
                </div>
              </DialogActions>
            </Dialog>
            <Dialog open={this.state.createS} maxWidth={false}>
              <DialogTitle style={{ textAlign: "center" }}>
                {"No se pudo buscar"}
              </DialogTitle>
              <DialogContent style={{ textAlign: "center" }}>
                {
                  "Para realizar una busqueda debe ingresar al menos un parametro"
                }
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <div className="o-btnBotNav-btnDiag3">
                  <GreenButton
                    onClick={() => this.setState({ createS: false })}
                  >
                    {"Aceptar"}
                  </GreenButton>
                </div>
              </DialogActions>
            </Dialog>
          </div>
        </Route>
        <Route path="/consultar_organizacion/editar">
          <OrganizacionMenu
            dbid_org={this.state.temp_id_org}
            token={this.props.token}
            box_spacing={this.state.box_spacing_tiny}
            subtitle_spacing={this.state.subtitle_spacing}
            box_size={this.state.box_size_tiny}
            box_size_table={this.state.box_size_table}
          />
        </Route>
      </Switch>
    );
  }
}

export default ConsultarOrganizacion;
