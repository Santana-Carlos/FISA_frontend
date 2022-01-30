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
  TablePagination,
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
  Fullscreen as IconFull,
  FullscreenExit as IconExit,
} from "@material-ui/icons";
import { Switch, Route } from "react-router-dom";
import OrganizacionMenu from "./OrganizacionMenu";
import "../Styles.css";

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
      pais_org: "",
      depest_org: "",
      city_org: "",
      sececo_org: "",
      subsec_org: "",
      createS: false,
      reqText: false,
      orgs: [],
      tipoid_org_api: [],
      cat_org_api: [],
      pais_org_api: [],
      depest_org_api: [],
      city_org_api: [],
      sececo_org_api: [],
      subsec_org_api: [],
      temp_id_org: [],
      delOrg: false,
      delcheck: false,
      delcheckOpen: false,
      loading: true,
      xpantOpen: false,
      currentPage: 0,
      rowsPerPage: 25,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "38rem" : "22rem",
      box_size_x: window.innerHeight > 900 ? "48rem" : "29rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.8rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "33rem" : "18rem",
      full_size_card: window.innerHeight > 900 ? false : true,
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "38rem" : "22rem",
      box_size_x: window.innerHeight > 900 ? "48rem" : "29rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.8rem" : "0rem",
      subtitle_spacing: window.innerHeight > 900 ? "2.1rem" : "1.7rem",
      box_size_tiny: window.innerHeight > 900 ? "24rem" : "13rem",
      box_size_table: window.innerHeight > 900 ? "33rem" : "18rem",
      full_size_card: window.innerHeight > 900 ? false : true,
    });
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "Organizacion/Data", {
      method: "POST",
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
          pais_org_api: data.paises,
          sececo_org_api: data.sectores,
        });
      })
      .catch((error) => {});
    window.setTimeout(this.callAPi, 500);
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
            currentPage: 0,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
      });
  };

  apiSearch = (e) => {
    e?.preventDefault();
    this.setState({ loading: true });

    const data = {
      numero_documento: this.state.nid_org,
      nombre: this.state.nomcom_org,
      razon_social: this.state.razsoc_org,
      documentos: this.state.tipoid_org,
      categorias:
        this.state.cat_org[0] === undefined
          ? null
          : this.state.cat_org.map((obj) => obj.id),
      sector: this.state.sececo_org,
      subsector: this.state.subsec_org,
      pais: this.state.pais_org,
      departamento: this.state.depest_org,
      ciudad: this.state.city_org,
    };
    //console.log(data);
    if (
      this.state.nid_org !== "" ||
      this.state.nomcom_org !== "" ||
      this.state.razsoc_org !== "" ||
      this.state.tipoid_org !== "" ||
      this.state.cat_org[0] !== undefined ||
      this.state.pais_org !== "" ||
      this.state.sececo_org !== ""
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
              currentPage: 0,
              reqText: false,
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({
        loading: false,
        reqText: true,
        currentPage: 0,
        createS: true,
      });
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
      this.state.cat_org[0] !== undefined ||
      this.state.pais_org !== "" ||
      this.state.sececo_org !== ""
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
                currentPage: 0,
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
        subsec_org: "",
        sececo_org: "",
        pais_org: "",
        depest_org: "",
        city_org: "",
        subsec_org_api: [],
        depest_org_api: [],
        city_org_api: [],
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
      case "input_pais_org":
        this.setState(
          { pais_org: value, depest_org: "", city_org: "" },
          this.updateDepest
        );
        break;
      case "input_depest_org":
        this.setState({ depest_org: value, city_org: "" }, this.updateCity);
        break;
      case "input_city_org":
        this.setState({ city_org: value });
        break;
      case "input_sececo_org":
        this.setState({ sececo_org: value, subsec_org: "" }, this.updateSubsec);
        break;
      case "input_subsec_org":
        this.setState({ subsec_org: value });
        break;
      default:
        break;
    }
  }

  updateDepest = () => {
    this.setState({
      city_org_api: [],
      loading: true,
    });

    const data = {
      pais_id: this.state.pais_org,
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
        this.setState({
          depest_org_api: data.estados,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  updateCity = () => {
    this.setState({
      loading: true,
    });

    const data = {
      departamento_estado_id: this.state.depest_org,
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
        this.setState({
          loading: false,
          city_org_api: data.ciudades,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  updateSubsec = () => {
    this.setState({
      loading: true,
    });
    const data = {
      sector_id: this.state.sececo_org,
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
        this.setState({
          subsec_org_api: data.subsectores,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    let BOX_SPACING = this.state.box_spacing;
    let BOX_SIZE = this.state.box_size;
    const BOX_SIZE_X = this.state.box_size_x;
    const currentPage = this.state.currentPage;
    const rowsPerPage = this.state.rowsPerPage;
    const rol = this.props.rol;
    const FULLSIZE_CARD = this.state.full_size_card;

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
            {this.state.xpantOpen ? (
              "Tabla extendida abierta"
            ) : (
              <div className="o-contentForm-big-consultas">
                <form
                  className="o-consultas-containerInit"
                  style={{ marginBottom: "0.7rem" }}
                >
                  <div className="o-consultas">
                    <TextField
                      label="Número ID"
                      variant="outlined"
                      value={this.state.nid_org || ""}
                      name="input_nid_org"
                      onChange={this.handleChange}
                      className="o-space"
                      margin="dense"
                    />
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
                  <FormControl
                    className="o-consultas"
                    style={{ margin: "0.8rem 1rem 0 0" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Categoría</InputLabel>
                    <Select
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
                  <div className="o-consultas-btnxn">
                    <div className="o-btnConsultas">
                      <BlueButton type="submit" onClick={this.apiSearch}>
                        Buscar
                      </BlueButton>
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
                </form>
                <TableContainer
                  className="o-tableBase-consultas"
                  style={{ display: "inline", height: BOX_SIZE }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Nombre</StyledTableCell>
                        <StyledTableCell>Identificación</StyledTableCell>
                        <StyledTableCell>Razón social</StyledTableCell>
                        <StyledTableCell>Categoría</StyledTableCell>
                        <StyledTableCell>Subsector</StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            size="small"
                            style={{ color: "#fff", marginRight: 0 }}
                            onClick={() =>
                              this.setState({
                                xpantOpen: true,
                              })
                            }
                          >
                            <IconFull />
                          </IconButton>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.orgs
                        .slice(
                          currentPage * rowsPerPage,
                          currentPage * rowsPerPage + rowsPerPage
                        )
                        .map((obj, i) => (
                          <TableRow key={i} hover={true}>
                            <StyledTableCell size="small">
                              {obj.nombre}
                            </StyledTableCell>
                            <StyledTableCell size="small">
                              {(obj.tipo_documento_organizacion || "-") +
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
                              {obj.subsector === null
                                ? emptyCell
                                : obj.subsector}
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
                                {rol !== "Comercial" && rol !== "Consulta" ? (
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
                                ) : null}
                              </div>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      {this.state.orgs[0] === undefined ? (
                        <TableRow>
                          <StyledTableCell>...</StyledTableCell>
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component={"div"}
                  style={{
                    margin: "0 0 0 auto",
                  }}
                  rowsPerPageOptions={[15, 25, 45]}
                  colSpan={9}
                  count={this.state.orgs.length}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  onChangePage={(e, page) =>
                    this.setState({ currentPage: page })
                  }
                  onChangeRowsPerPage={(e) =>
                    this.setState({
                      currentPage: 0,
                      rowsPerPage: parseInt(e.target.value, 10),
                    })
                  }
                  labelRowsPerPage="Filas por página"
                  nextIconButtonText="Siguiente página"
                  backIconButtonText="Página anterior"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from} - ${to} de ${
                      count !== -1 ? count : `más que ${to}`
                    }`
                  }
                />
              </div>
            )}
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

            <Dialog
              open={this.state.xpantOpen}
              onClose={() => this.setState({ xpantOpen: false })}
              PaperProps={{
                style: {
                  height: FULLSIZE_CARD ? "100%" : "calc(100% - 64px)",
                  maxHeight: "100%",
                  overflow: "hidden",
                },
              }}
              fullWidth
              maxWidth="xl"
            >
              <DialogContent
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "76%",
                    height: "100%",
                    marginRight: "1.6rem",
                  }}
                >
                  <div className="o-contentForm-big-consultas">
                    <TableContainer
                      className="o-tableBase-consultas"
                      style={{
                        display: "inline",
                        height: BOX_SIZE_X,
                      }}
                    >
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Nombre</StyledTableCell>
                            <StyledTableCell>Identificación</StyledTableCell>
                            <StyledTableCell>Razón social</StyledTableCell>
                            <StyledTableCell>Categoría</StyledTableCell>
                            <StyledTableCell>Subsector</StyledTableCell>
                            <StyledTableCell align="right">
                              <IconButton
                                size="small"
                                style={{ color: "#fff", marginRight: 0 }}
                                onClick={() =>
                                  this.setState({
                                    xpantOpen: false,
                                  })
                                }
                              >
                                <IconExit />
                              </IconButton>
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.orgs
                            .slice(
                              currentPage * rowsPerPage,
                              currentPage * rowsPerPage + rowsPerPage
                            )
                            .map((obj, i) => (
                              <TableRow key={i} hover={true}>
                                <StyledTableCell size="small">
                                  {obj.nombre}
                                </StyledTableCell>
                                <StyledTableCell size="small">
                                  {(obj.tipo_documento_organizacion || "-") +
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
                                  {obj.subsector === null
                                    ? emptyCell
                                    : obj.subsector}
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
                              <StyledTableCell />
                              <StyledTableCell />
                              <StyledTableCell />
                              <StyledTableCell />
                              <StyledTableCell />
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
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
                      <TablePagination
                        component={"div"}
                        style={{
                          margin: "0 0 0 auto",
                        }}
                        rowsPerPageOptions={[15, 25, 45]}
                        colSpan={9}
                        count={this.state.orgs.length}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onChangePage={(e, page) =>
                          this.setState({ currentPage: page })
                        }
                        onChangeRowsPerPage={(e) =>
                          this.setState({
                            currentPage: 0,
                            rowsPerPage: parseInt(e.target.value, 10),
                          })
                        }
                        labelRowsPerPage="Filas por página"
                        nextIconButtonText="Siguiente página"
                        backIconButtonText="Página anterior"
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from} - ${to} de ${
                            count !== -1 ? count : `más que ${to}`
                          }`
                        }
                      />
                    </div>
                  </div>
                </div>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "23%",
                    height: "100%",
                  }}
                >
                  <div className="o-consultasx">
                    <div className="o-dobleInput">
                      <FormControl
                        variant="outlined"
                        margin="dense"
                        className="o-selectShort"
                        style={{ width: "7rem" }}
                      >
                        <InputLabel>ID</InputLabel>
                        <Select
                          value={this.state.tipoid_org || ""}
                          onChange={this.handleChange}
                          label="ID"
                          name="input_tipoid_org"
                        >
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
                  <div className="o-consultasx">
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
                  <div className="o-consultasx">
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
                    className="o-consultasx"
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Categoría</InputLabel>
                    <Select
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

                  <FormControl
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Sector económico</InputLabel>
                    <Select
                      value={this.state.sececo_org || ""}
                      onChange={this.handleChange}
                      label="Sector económico"
                      name="input_sececo_org"
                      className="o-space"
                    >
                      {this.state.sececo_org_api.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj.id}>
                            {obj.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Subsector económico</InputLabel>
                    <Select
                      value={this.state.subsec_org || ""}
                      onChange={this.handleChange}
                      label="Subsector económico"
                      name="input_subsec_org"
                      className="o-space"
                    >
                      {this.state.subsec_org_api.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj.id}>
                            {obj.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>País</InputLabel>
                    <Select
                      value={this.state.pais_org || ""}
                      onChange={this.handleChange}
                      label="País"
                      name="input_pais_org"
                      className="o-space"
                    >
                      {this.state.pais_org_api.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj.id}>
                            {obj.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Departamento/Estado</InputLabel>
                    <Select
                      value={this.state.depest_org || ""}
                      onChange={this.handleChange}
                      label="Departamento/Estado"
                      name="input_depest_org"
                      className="o-space"
                    >
                      {this.state.depest_org_api.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj.id}>
                            {obj.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={this.state.city_org || ""}
                      onChange={this.handleChange}
                      label="Ciudad"
                      name="input_city_org"
                      className="o-space"
                    >
                      {this.state.city_org_api.map((obj, i) => {
                        return (
                          <MenuItem key={i} value={obj.id}>
                            {obj.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <div className="o-consultas-btnx">
                    <div className="o-btnConsultas">
                      <BlueButton type="submit" onClick={this.apiSearch}>
                        Buscar
                      </BlueButton>
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
                </form>
              </DialogContent>
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
            rol={this.props.rol}
          />
        </Route>
      </Switch>
    );
  }
}

export default ConsultarOrganizacion;
