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
  TablePagination,
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
  "organizacions.numero_documento",
  "organizacions.nombre",
  "organizacions.razon_social",
];

const reportType = [
  {
    id: 1,
    nombre: "General",
  },
  {
    id: 2,
    nombre: "Financiero",
  },
];

const emptyCell = "-";

class ReporteOrganizacion extends Component {
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
      reportType: reportType[0].id,
      orgs: [],
      tipoid_org_api: [],
      cat_org_api: [],
      loading: true,
      searched: false,
      currentPage: 0,
      rowsPerPage: 25,
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "34rem" : "18rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.6rem" : "0.2rem",
      box_size: window.innerHeight > 900 ? "34rem" : "18rem",
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
            currentPage: 0,
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
          //console.log(data);
          if (data.success) {
            this.setState({
              loading: false,
              searched: true,
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
        createS: true,
        currentPage: 0,
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
      this.state.cat_org[0] !== undefined
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

  apiReportA = () => {
    const tipo = this.state.reportType;
    switch (tipo) {
      case 1:
        this.apiReportGen();
        break;
      case 2:
        this.apiReportGenFin();
        break;
      default:
        break;
    }
  };

  apiReportB = () => {
    const tipo = this.state.reportType;
    switch (tipo) {
      case 1:
        this.apiReportBus();
        break;
      case 2:
        this.apiReportBusFin();
        break;
      default:
        break;
    }
  };

  apiReportGen = () => {
    this.setState({ loading: true });
    fetch(process.env.REACT_APP_API_URL + "Organizacion/RepGen", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        this.setState({ loading: false });
        saveAs(data, "ORGANIZACIONES_REPORTE_GENERAL");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  apiReportBus = () => {
    this.setState({ loading: true });
    const orgsList = this.state.orgs;
    const orgIdList =
      orgsList[0] !== undefined ? orgsList.map((obj) => obj.id) : [];
    const data = {
      ids: orgIdList,
    };
    //console.log(data);

    fetch(process.env.REACT_APP_API_URL + "Organizacion/RepBus", {
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
        saveAs(data, "ORGANIZACIONES_REPORTE");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  apiReportGenFin = () => {
    this.setState({ loading: true });
    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/RepGen", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        this.setState({ loading: false });
        saveAs(data, "FINANCIERO_REPORTE_GENERAL");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  apiReportBusFin = () => {
    this.setState({ loading: true });
    const orgsList = this.state.orgs;
    const orgIdList =
      orgsList[0] !== undefined ? orgsList.map((obj) => obj.id) : [];
    const data = {
      ids: orgIdList,
    };
    //console.log(data);

    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/RepBus", {
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
        saveAs(data, "FINANCIERO_REPORTE");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

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
      case "input_reportType":
        this.setState({ reportType: value });
        break;
      default:
        break;
    }
  }

  render() {
    let BOX_SPACING = this.state.box_spacing;
    let BOX_SIZE = this.state.box_size;
    const currentPage = this.state.currentPage;
    const rowsPerPage = this.state.rowsPerPage;

    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3
            className="o-contentTittle-principal"
            style={{ marginTop: "0.2rem" }}
          >
            {"Generar reporte de organizaciones"}
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
                        this.state.cat_org.findIndex((x) => x.id === obj.id) >
                        -1
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
              <FormControl
                style={{
                  width: "20%",
                  marginTop: "0",
                  marginLeft: "auto",
                  marginRight: "0.6rem",
                }}
                variant="outlined"
                margin="dense"
              >
                <InputLabel>Reporte</InputLabel>
                <Select
                  value={this.state.reportType || ""}
                  onChange={this.handleChange}
                  label="Reporte"
                  name="input_reportType"
                  className="o-space"
                >
                  {reportType.map((obj, i) => {
                    return (
                      <MenuItem key={i} value={obj.id}>
                        {obj.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <div
                className="o-btnConsultas"
                style={{ width: "4rem", marginRight: 0 }}
              >
                <GreenButton
                  onClick={
                    this.state.searched ? this.apiReportB : this.apiReportA
                  }
                >
                  <IconDownload size="small" />
                </GreenButton>
              </div>
            </div>
          </div>
          <TableContainer
            className="o-tableBase-consultas"
            style={{ display: "inline", maxHeight: BOX_SIZE }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nombre</StyledTableCell>
                  <StyledTableCell>Identificación</StyledTableCell>
                  <StyledTableCell>Razón social</StyledTableCell>
                  <StyledTableCell>Categoría</StyledTableCell>
                  <StyledTableCell>Subsector</StyledTableCell>
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
                    </TableRow>
                  ))}
                {this.state.orgs[0] === undefined ? (
                  <TableRow>
                    <StyledTableCell>...</StyledTableCell>
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
            onChangePage={(e, page) => this.setState({ currentPage: page })}
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
              `${from} - ${to} de ${count !== -1 ? count : `más que ${to}`}`
            }
          />
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

export default ReporteOrganizacion;
