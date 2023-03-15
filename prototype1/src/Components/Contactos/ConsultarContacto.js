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
  Checkbox,
  Fade,
  CircularProgress,
  ButtonBase,
} from "@material-ui/core";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCellSuperTiny as StyledTableCell,
  StyledIconButton as IconButton,
  StyledTooltip,
} from "../Buttons";
import {
  Delete as IconDelete,
  Edit as IconEdit,
  Refresh as IconRefresh,
  Fullscreen as IconFull,
  FullscreenExit as IconExit,
  FilterList as IconFilter,
  CloseRounded,
  TextRotationAngledown as IconDes,
  TextRotationAngleup as IconAsc,
} from "@material-ui/icons";
import { Switch, Route } from "react-router-dom";
import EditarContacto from "./EditarContacto";
import "../Styles.css";

const emptyCell = "-";

class ConsultarContacto extends Component {
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
      pais_org: "",
      depest_org: "",
      city_org: "",
      sececo_org: "",
      subsec_org: "",
      cat_org: [],
      subcat_con: [],
      cat_org_api: [],
      subcat_con_api: [],
      pais_org_api: [],
      depest_org_api: [],
      city_org_api: [],
      sececo_org_api: [],
      subsec_org_api: [],
      temp_id_con: "",
      temp_id_per: "",
      delCon: false,
      loading: true,
      xpantOpen: false,
      currentPage: 0,
      rowsPerPage: 50,
      totalRows: 0,
      currentFilter: "",
      currentOrder: "",
      contactsSort: [],
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.8rem" : "0rem",
      box_size:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 160px)"
          : "calc(100vh - 5.9rem - 128px)",
      box_size_x:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 60px)"
          : "calc(100vh - 5.9rem - 50px)",
      full_size_card: window.innerHeight > 900 ? false : true,
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_spacing_tiny: window.innerHeight > 900 ? "0.8rem" : "0rem",
      box_size:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 160px)"
          : "calc(100vh - 5.9rem - 128px)",
      box_size_x:
        window.innerHeight > 900
          ? "calc(100vh - 5.9rem - 60px)"
          : "calc(100vh - 5.9rem - 50px)",
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
          cat_org_api: data.categorias,
          pais_org_api: data.paises,
          sececo_org_api: data.sectores,
        });
      })
      .catch((error) => {});
    fetch(process.env.REACT_APP_API_URL + "Contacto/Data", {
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.rowsPerPage !== this.state.rowsPerPage ||
      prevState.currentPage !== this.state.currentPage ||
      prevState.currentFilter !== this.state.currentFilter ||
      prevState.currentOrder !== this.state.currentOrder
    ) {
      if (
        this.state.nombre_org !== "" ||
        this.state.nombre_con !== "" ||
        this.state.apell_con !== "" ||
        this.state.cargo_con !== "" ||
        this.state.correo_con !== "" ||
        this.state.cat_org[0] !== undefined ||
        this.state.subcat_con[0] !== undefined ||
        this.state.pais_org !== "" ||
        this.state.sececo_org !== ""
      ) {
        this.apiSearch(undefined, true);
      } else {
        this.callAPi(true);
      }
    }
  }

  callAPi = (dontChangeRow) => {
    fetch(
      dontChangeRow
        ? `${process.env.REACT_APP_API_URL}Contacto?skip=${
            this.state.currentPage * this.state.rowsPerPage
          }&limit=${this.state.rowsPerPage}&orderKey=${
            this.state.currentFilter
          }&orderType=${this.state.currentOrder}`
        : `${process.env.REACT_APP_API_URL}Contacto?skip=${0}&limit=${
            this.state.rowsPerPage
          }&orderKey=${""}&orderType=${""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          if (dontChangeRow)
            this.setState({
              contacts: data.contactos,
              contactsSort: data.contactos,
              totalRows: data.total || "0",
              loading: false,
            });
          else
            this.setState({
              contacts: data.contactos,
              contactsSort: data.contactos,
              totalRows: data.total || "0",
              currentFilter: "",
              currentOrder: "",
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

  apiSearch = (e, dontChangeRow) => {
    e?.preventDefault();
    this.setState({ loading: true });

    const data = {
      nombres: this.state.nombre_con,
      organizacion: this.state.nombre_org,
      cargo: this.state.cargo_con,
      email: this.state.correo_con,
      categorias:
        this.state.cat_org[0] === undefined
          ? null
          : this.state.cat_org.map((obj) => obj.id),
      subcategorias:
        this.state.subcat_con[0] === undefined
          ? null
          : this.state.subcat_con.map((obj) => obj.id),
      sector: this.state.sececo_org,
      subsector: this.state.subsec_org,
      pais: this.state.pais_org,
      departamento: this.state.depest_org,
      ciudad: this.state.city_org,
      skip: dontChangeRow ? this.state.currentPage * this.state.rowsPerPage : 0,
      limit: this.state.rowsPerPage,
      orderType: dontChangeRow ? this.state.currentOrder : "",
      orderKey: dontChangeRow ? this.state.currentFilter : "",
    };

    //console.log(data);
    if (
      this.state.nombre_org !== "" ||
      this.state.nombre_con !== "" ||
      this.state.apell_con !== "" ||
      this.state.cargo_con !== "" ||
      this.state.correo_con !== "" ||
      this.state.cat_org[0] !== undefined ||
      this.state.subcat_con[0] !== undefined ||
      this.state.pais_org !== "" ||
      this.state.sececo_org !== ""
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
          //console.log(data);
          if (data.success) {
            if (dontChangeRow)
              this.setState({
                loading: false,
                contacts: data.contactos,
                contactsSort: data.contactos,
                reqText: false,
                totalRows: data.total || 0,
              });
            else
              this.setState({
                loading: false,
                contacts: data.contactos,
                contactsSort: data.contactos,
                reqText: false,
                currentPage: 0,
                currentFilter: "",
                currentOrder: "",
                totalRows: data.total || 0,
              });
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    } else {
      this.setState({
        loading: false,
        reqText: true,
        currentPage: 0,
        currentFilter: "",
        createS: true,
      });
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
      this.state.cat_org[0] !== undefined ||
      this.state.subcat_con[0] !== undefined ||
      this.state.pais_org !== "" ||
      this.state.sececo_org !== ""
    ) {
      this.apiSearch();
    } else {
      this.callAPi();
    }
  };

  handleClickOpenDel = () => {
    this.setState({ delCon: true });
  };

  handleCloseDel = (a) => {
    const idCon = this.state.temp_id_con;
    if (a) {
      this.setState({ loading: true });
      fetch(process.env.REACT_APP_API_URL + "Contacto/" + idCon, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      }).catch((error) => {});
    }
    this.setState({
      delCon: false,
      temp_id_con: "",
    });
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  editCon = () => {
    window.location.assign("/dashboard/contacto#/consultar_contacto/editar");
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
        cat_org: [],
        subcat_con: [],
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
      case "input_cat_org":
        this.setState({ cat_org: value });
        break;
      case "input_subcat_con":
        this.setState({ subcat_con: value });
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

  sortBy = (name) => {
    if (this.state.currentFilter === name) {
      if (this.state.currentOrder === "ASC")
        this.setState({
          currentFilter: name,
          currentOrder: "DESC",
          currentPage: 0,
        });
      else
        this.setState({
          currentFilter: "",
          currentOrder: "",
          currentPage: 0,
        });
    } else {
      this.setState({
        currentFilter: name,
        currentOrder: "ASC",
        currentPage: 0,
      });
    }
  };

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
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE = this.state.box_size;
    const BOX_SIZE_X = this.state.box_size_x;
    const currentPage = this.state.currentPage;
    const rowsPerPage = this.state.rowsPerPage;
    const totalRows = this.state.totalRows;
    const filter = this.state.currentFilter;
    const filterOrder = this.state.currentOrder;
    const rol = this.props.rol;
    const FULLSIZE_CARD = this.state.full_size_card;

    return (
      <Switch>
        <Route exact path="/consultar_contacto">
          <div className="o-cardContent">
            <div className="o-contentTittle">
              <h3
                className="o-contentTittle-principal"
                style={{ marginTop: "0.2rem" }}
              >
                Consultar contactos
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
                  <div
                    className="o-consultas"
                    style={{ marginBottom: BOX_SPACING }}
                  >
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
                  <div
                    className="o-consultas"
                    style={{ marginBottom: BOX_SPACING }}
                  >
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

                  <FormControl
                    className="o-consultas"
                    style={{ marginTop: "0.8rem", marginRight: "1rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Subcategoría</InputLabel>
                    <Select
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
                        <StyledTableCell>
                          <ButtonBase
                            style={{
                              fontSize: "inherit",
                              fontFamily: "inherit",
                            }}
                            onClick={() => this.sortBy("organizacion")}
                          >
                            Org.
                            {filter === "organizacion" &&
                            filterOrder === "DESC" ? (
                              <IconDes
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            ) : filter === "organizacion" &&
                              filterOrder === "ASC" ? (
                              <IconAsc
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            ) : (
                              <IconFilter
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            )}
                          </ButtonBase>
                        </StyledTableCell>
                        <StyledTableCell>
                          <ButtonBase
                            style={{
                              fontSize: "inherit",
                              fontFamily: "inherit",
                            }}
                            onClick={() => this.sortBy("nombres")}
                          >
                            Nombre
                            {filter === "nombres" && filterOrder === "DESC" ? (
                              <IconDes
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            ) : filter === "nombres" &&
                              filterOrder === "ASC" ? (
                              <IconAsc
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            ) : (
                              <IconFilter
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            )}
                          </ButtonBase>
                        </StyledTableCell>
                        <StyledTableCell>
                          <ButtonBase
                            style={{
                              fontSize: "inherit",
                              fontFamily: "inherit",
                            }}
                            onClick={() => this.sortBy("cargo")}
                          >
                            Cargo
                            {filter === "cargo" && filterOrder === "DESC" ? (
                              <IconDes
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            ) : filter === "cargo" && filterOrder === "ASC" ? (
                              <IconAsc
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            ) : (
                              <IconFilter
                                style={{
                                  margin: "0 0 0 0.5rem",
                                }}
                              />
                            )}
                          </ButtonBase>
                        </StyledTableCell>
                        <StyledTableCell>Teléfono</StyledTableCell>
                        <StyledTableCell>Ext.</StyledTableCell>
                        <StyledTableCell>Celular</StyledTableCell>
                        <StyledTableCell>Correo</StyledTableCell>
                        <StyledTableCell>Obser.</StyledTableCell>
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
                      {this.state.contacts.map?.((obj, i) => (
                        <TableRow key={i} hover={true}>
                          <StyledTableCell size="small">
                            {obj.organizacion}
                          </StyledTableCell>
                          <StyledTableCell size="small">
                            {obj.nombres || emptyCell}
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
                          <StyledTooltip
                            title={obj.email === null ? emptyCell : obj.email}
                          >
                            <StyledTableCell size="small">
                              {obj.email === null ? emptyCell : obj.email}
                            </StyledTableCell>
                          </StyledTooltip>
                          <StyledTableCell size="small">
                            {obj.observaciones === null
                              ? emptyCell
                              : obj.observaciones}
                          </StyledTableCell>
                          <StyledTableCell size="small" align="right">
                            <div className="o-row-btnIcon">
                              <IconButton
                                size="small"
                                style={{ color: "#47B14C" }}
                                onClick={() =>
                                  this.setState(
                                    {
                                      temp_id_con: obj.contacto_id,
                                      temp_id_per: obj.persona_id,
                                    },
                                    this.editCon
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
                                        temp_id_con: obj.contacto_id,
                                        temp_id_per: obj.persona_id,
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
                        </TableRow>
                      ))}
                      {this.state.contactsSort[0] === undefined ? (
                        <TableRow>
                          <StyledTableCell>...</StyledTableCell>
                          <StyledTableCell />
                          <StyledTableCell />
                          <StyledTableCell />
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
                  rowsPerPageOptions={[15, 25, 50, 100]}
                  colSpan={9}
                  count={totalRows}
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
              open={this.state.delCon}
              onClose={() => this.handleCloseDel(false)}
              maxWidth={false}
            >
              <DialogTitle style={{ textAlign: "center" }}>
                {"¿Desea eliminar el contacto?"}
              </DialogTitle>
              <DialogContent></DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <div className="o-btnBotNav-btnDiag3">
                  <RedButton onClick={() => this.handleCloseDel(true)}>
                    {"Eliminar"}
                  </RedButton>
                </div>
                <div className="o-btnBotNav-btnDiag3">
                  <GreenButton onClick={() => this.handleCloseDel(false)}>
                    {"Cancelar"}
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
                  "Para realizar una busqueda debe ingresar al menos el primer parametro"
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
              <IconButton
                size="small"
                style={{
                  color: "#fff",
                  position: "absolute",
                  top: 2,
                  right: 2,
                }}
                onClick={() =>
                  this.setState({
                    xpantOpen: false,
                  })
                }
              >
                <CloseRounded style={{ color: "gray" }} />
              </IconButton>
              <DialogContent
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingTop: 20,
                  paddingBottom: 0,
                }}
              >
                <div
                  style={{
                    width: "76%",
                    height: "calc(100% - 3px)",
                    marginRight: "1.6rem",
                  }}
                >
                  <div
                    className="o-contentForm-big-consultas"
                    style={{ height: "calc(100% - 6px)" }}
                  >
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
                            <StyledTableCell>
                              <ButtonBase
                                style={{
                                  fontSize: "inherit",
                                  fontFamily: "inherit",
                                }}
                                onClick={() => this.sortBy("organizacion")}
                              >
                                Org.
                                {filter === "organizacion" &&
                                filterOrder === "DESC" ? (
                                  <IconDes
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                ) : filter === "organizacion" &&
                                  filterOrder === "ASC" ? (
                                  <IconAsc
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                ) : (
                                  <IconFilter
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                )}
                              </ButtonBase>
                            </StyledTableCell>
                            <StyledTableCell>
                              <ButtonBase
                                style={{
                                  fontSize: "inherit",
                                  fontFamily: "inherit",
                                }}
                                onClick={() => this.sortBy("nombre")}
                              >
                                Nombre
                                {filter === "nombre" &&
                                filterOrder === "DESC" ? (
                                  <IconDes
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                ) : filter === "nombre" &&
                                  filterOrder === "ASC" ? (
                                  <IconAsc
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                ) : (
                                  <IconFilter
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                )}
                              </ButtonBase>
                            </StyledTableCell>
                            <StyledTableCell>
                              <ButtonBase
                                style={{
                                  fontSize: "inherit",
                                  fontFamily: "inherit",
                                }}
                                onClick={() => this.sortBy("cargo")}
                              >
                                Cargo
                                {filter === "cargo" &&
                                filterOrder === "DESC" ? (
                                  <IconDes
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                ) : filter === "cargo" &&
                                  filterOrder === "ASC" ? (
                                  <IconAsc
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                ) : (
                                  <IconFilter
                                    style={{
                                      margin: "0 0 0 0.5rem",
                                    }}
                                  />
                                )}
                              </ButtonBase>
                            </StyledTableCell>
                            <StyledTableCell>Teléfono</StyledTableCell>
                            <StyledTableCell>Ext.</StyledTableCell>
                            <StyledTableCell>Celular</StyledTableCell>
                            <StyledTableCell>Correo</StyledTableCell>
                            <StyledTableCell>Obser.</StyledTableCell>
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
                          {this.state.contacts.map?.((obj, i) => (
                            <TableRow key={i} hover={true}>
                              <StyledTableCell size="small">
                                {obj.organizacion}
                              </StyledTableCell>
                              <StyledTableCell size="small">
                                {obj.nombres || emptyCell}
                              </StyledTableCell>
                              <StyledTableCell size="small">
                                {obj.cargo === null ? emptyCell : obj.cargo}
                              </StyledTableCell>
                              <StyledTableCell size="small">
                                {obj.telefono === null
                                  ? emptyCell
                                  : obj.telefono}
                              </StyledTableCell>
                              <StyledTableCell size="small">
                                {obj.extension === null
                                  ? emptyCell
                                  : obj.extension}
                              </StyledTableCell>
                              <StyledTableCell size="small">
                                {obj.celular === null ? emptyCell : obj.celular}
                              </StyledTableCell>
                              <StyledTooltip
                                title={
                                  obj.email === null ? emptyCell : obj.email
                                }
                              >
                                <StyledTableCell size="small">
                                  {obj.email === null ? emptyCell : obj.email}
                                </StyledTableCell>
                              </StyledTooltip>
                              <StyledTableCell size="small">
                                {obj.observaciones === null
                                  ? emptyCell
                                  : obj.observaciones}
                              </StyledTableCell>
                              <StyledTableCell size="small" align="right">
                                <div className="o-row-btnIcon">
                                  <IconButton
                                    size="small"
                                    style={{ color: "#47B14C" }}
                                    onClick={() =>
                                      this.setState(
                                        {
                                          temp_id_con: obj.contacto_id,
                                          temp_id_per: obj.persona_id,
                                        },
                                        this.editCon
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
                                        {
                                          temp_id_con: obj.contacto_id,
                                          temp_id_per: obj.persona_id,
                                        },
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
                          {this.state.contacts[0] === undefined ? (
                            <TableRow>
                              <StyledTableCell>...</StyledTableCell>
                              <StyledTableCell />
                              <StyledTableCell />
                              <StyledTableCell />
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
                        rowsPerPageOptions={[15, 25, 50, 100]}
                        colSpan={9}
                        count={totalRows}
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
                    {FULLSIZE_CARD ? (
                      <div className="o-consultas-btnx2">
                        <div className="o-btnConsultas">
                          <BlueButton type="submit" onClick={this.apiSearch}>
                            Buscar
                          </BlueButton>
                        </div>
                        <div className="o-btnConsultas">
                          <RedButton onClick={this.clearFunc}>
                            Limpiar
                          </RedButton>
                        </div>
                        <div
                          className="o-btnConsultas"
                          style={{ width: "4rem" }}
                        >
                          <BlueButton onClick={this.apiRefresh}>
                            <IconRefresh size="small" />
                          </BlueButton>
                        </div>
                      </div>
                    ) : null}
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
                  <div className="o-consultasx">
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
                  <div className="o-consultasx">
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
                  <div className="o-consultasx">
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
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Categoría Org.</InputLabel>
                    <Select
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
                    <InputLabel>Subcategoría</InputLabel>
                    <Select
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

                  <FormControl
                    className="o-consultasx"
                    style={{ marginTop: "0.8rem" }}
                    variant="outlined"
                    margin="dense"
                  >
                    <InputLabel>Sector económico Org.</InputLabel>
                    <Select
                      value={this.state.sececo_org || ""}
                      onChange={this.handleChange}
                      label="Sector económico Org."
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
                    <InputLabel>Subsector económico Org.</InputLabel>
                    <Select
                      value={this.state.subsec_org || ""}
                      onChange={this.handleChange}
                      label="Subsector económico Org."
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
                    <InputLabel>País Org.</InputLabel>
                    <Select
                      value={this.state.pais_org || ""}
                      onChange={this.handleChange}
                      label="País Org."
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
                    <InputLabel>Departamento/Estado Org.</InputLabel>
                    <Select
                      value={this.state.depest_org || ""}
                      onChange={this.handleChange}
                      label="Departamento/Estado Org."
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
                    <InputLabel>Ciudad Org.</InputLabel>
                    <Select
                      value={this.state.city_org || ""}
                      onChange={this.handleChange}
                      label="Ciudad Org"
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
                  {FULLSIZE_CARD ? null : (
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
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </Route>
        <Route path="/consultar_contacto/editar">
          <EditarContacto
            token={this.props.token}
            rol={this.props.rol}
            temp_id_con={this.state.temp_id_con}
            temp_id_per={this.state.temp_id_per}
            box_spacing={this.state.box_spacing_tiny}
          />
        </Route>
      </Switch>
    );
  }
}

export default ConsultarContacto;
