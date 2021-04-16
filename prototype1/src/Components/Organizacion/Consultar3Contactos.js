import React, { Component } from "react";
import {
  IconButton,
  InputLabel,
  FormControlLabel,
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
  Checkbox,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import {
  Delete as IconDelete,
  Edit as IconEdit,
  Add as IconAdd,
  AddCircleOutline as IconAddCircle,
  Refresh as IconRefresh,
} from "@material-ui/icons";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
} from "../Buttons";
import { Autocomplete } from "@material-ui/lab";
import { Link } from "react-router-dom";
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

class Consultar3Contactos extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      dbid_org: props.dbid_org,
      reqText: false,
      temp_id_con: "",
      temp_id_per: "",
      contacts: [],
      addContact: false,
      delContact: false,
      createS: false,
      tipoid_con_api: [],
      subcat_con_api: [],
      ofices_api: [],
      sex_con_api: [],
      estado_con_api: [
        {
          id: true,
          nombre: "ACTIVO",
        },
        {
          id: false,
          nombre: "INACTIVO",
        },
      ],
      temp_idoffice_con: "",
      temp_nombre_con: "",
      temp_apell_con: "",
      temp_cargo_con: "",
      temp_replegal_con: false,
      temp_tratodata_con: false,
      temp_enviodata_con: false,
      temp_tel_con: "",
      temp_ext_con: "",
      temp_cel_con: "",
      temp_correo_con: "",
      temp_correo2_con: "",
      temp_obs_con: "",
      temp_tipoid_con: "",
      temp_nid_con: "",
      temp_sex_con: "",
      temp_estado_con: "",
      temp_subcat_con: [],
      temp_subcatFake_con: [],
      contExist: false,
      search_nombre_org: "",
      search_nombre_con: "",
      search_apell_con: "",
      search_cargo_con: "",
      contacts_api: [],
      cat_org_api: [],
      loading: true,
      loadingDiag: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSubcat = this.handleChangeSubcat.bind(this);
  }

  componentDidMount() {
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
          tipoid_con_api: data.tipos,
          subcat_con_api: data.subcategorias,
          sex_con_api: data.sexos,
        });
      })
      .catch((error) => {});
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
          cat_org_api: data.categorias,
        });
      })
      .catch((error) => {});
    this.callApiOrg();
    this.callApiCont();
    this.callAPi();
  }

  callAPi = () => {
    const data = {
      organizacion_id: this.state.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "Contacto/Org", {
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
        this.setState(
          {
            contacts: data.contactos,
            loading: false,
          },
          this.callAPiOff
        );
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiOrg = () => {
    fetch(process.env.REACT_APP_API_URL + "Organizacion/SimpList", {
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
          orgs_api: data.organizaciones,
        });
      })
      .catch((error) => {});
  };

  callAPiOff = () => {
    const data = {
      organizacion_id: this.state.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "Oficina/Org", {
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
          ofices_api: data.oficinas,
        });
      })
      .catch((error) => {});
  };

  callApiCont = () => {
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
            contacts_api: data.contactos,
            loadingDiag: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          loadingDiag: false,
        });
      });
  };

  handleClickOpen = () => {
    const idCon = this.state.temp_id_con;
    if (idCon !== "") {
      fetch(process.env.REACT_APP_API_URL + "Contacto/" + idCon, {
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
          this.setState(
            {
              temp_idoffice_con: data.contacto.oficina_id,
              temp_nombre_con: data.contacto.nombres,
              temp_apell_con: data.contacto.apellidos,
              temp_cargo_con: data.contacto.cargo,
              temp_replegal_con: data.contacto.representante,
              temp_tratodata_con: data.contacto.control_informacion,
              temp_enviodata_con: data.contacto.envio_informacion,
              temp_tel_con: data.contacto.telefono,
              temp_ext_con: data.contacto.extension,
              temp_cel_con: data.contacto.celular,
              temp_correo_con: data.contacto.email,
              temp_correo2_con: data.contacto.email_2,
              temp_obs_con: data.contacto.observaciones,
              temp_tipoid_con: data.contacto.tipo_documento_persona_id,
              temp_nid_con: data.contacto.numero_documento,
              temp_sex_con: data.contacto.sexo_id,
              temp_estado_con: data.contacto.estado,
              loadingDiag: false,
              temp_subcat_con:
                data.categorias[0] === this.state.indexCat
                  ? []
                  : data.categorias,
            },
            this.subcatFake
          );
        })
        .catch((error) => {
          this.setState({ loadingDiag: false });
        });
    }
    this.setState({ addContact: true });
  };

  subcatFake = () => {
    const tempSubcat = this.state.subcat_con_api;
    const tempFake = tempSubcat.filter((obj) => {
      for (let j = 0; j < this.state.temp_subcat_con.length; j++) {
        if (obj.id === this.state.temp_subcat_con[j]) {
          return true;
        }
      }
      return false;
    });
    this.setState({ temp_subcatFake_con: tempFake });
  };

  handleClose = (a) => {
    if (a) {
      this.callApipostContacto();
    } else {
      this.clearTemp();
      this.setState({ addContact: false, reqText: false });
    }
  };

  handleClickOpenDel = () => {
    this.setState({ delContact: true });
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
      delContact: false,
      temp_id_con: "",
      temp_id_per: "",
    });
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  callApipostContacto = () => {
    this.setState({ loadingDiag: true });
    const idCon = this.state.temp_id_con;
    const data = {
      persona_id: this.state.temp_id_per,
      organizacion_id: this.state.dbid_org,
      oficina_id: this.state.temp_idoffice_con,
      nombres: this.state.temp_nombre_con,
      apellidos: this.state.temp_apell_con,
      cargo: this.state.temp_cargo_con,
      representante: this.state.temp_replegal_con,
      control_informacion: this.state.temp_tratodata_con,
      envio_informacion: this.state.temp_enviodata_con,
      telefono: this.state.temp_tel_con,
      extension: this.state.temp_ext_con,
      celular: this.state.temp_cel_con,
      email: this.state.temp_correo_con,
      email_2: this.state.temp_correo2_con,
      estado: this.state.temp_estado_con,
      observaciones: this.state.temp_obs_con,
      tipo_documento_persona_id: this.state.temp_tipoid_con,
      numero_documento: this.state.temp_nid_con,
      sexo_id: this.state.temp_sex_con,
      categorias: this.state.temp_subcat_con,
    };
    console.log(data);
    if (idCon === "") {
      fetch(process.env.REACT_APP_API_URL + "Contacto/", {
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
              addContact: false,
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
      fetch(process.env.REACT_APP_API_URL + "Contacto/" + idCon, {
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
          console.log(data);
          if (data.success) {
            this.setState({
              loading: true,
              loadingDiag: false,
              addContact: false,
              reqText: false,
            });
            this.clearTemp();
          }
        })
        .catch((error) => {
          this.setState({ loadingDiag: false, reqText: true, createS: true });
        });
    }
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  clearTemp = () => {
    this.setState({
      temp_id_con: "",
      temp_id_per: "",
      temp_idoffice_con: "",
      temp_nombre_con: "",
      temp_apell_con: "",
      temp_cargo_con: "",
      temp_replegal_con: false,
      temp_tratodata_con: false,
      temp_enviodata_con: false,
      temp_tel_con: "",
      temp_ext_con: "",
      temp_cel_con: "",
      temp_correo_con: "",
      temp_correo2_con: "",
      temp_obs_con: "",
      temp_tipoid_con: "",
      temp_nid_con: "",
      temp_sex_con: "",
      temp_subcat_con: [],
      temp_subcatFake_con: [],
      temp_estado_con: "",
      subcatSearch: "",
    });
  };

  apiSearch = () => {
    this.setState({ loadingDiag: true });
    const nombreOrg = this.state.search_nombre_org + "%";
    const nombreCon = this.state.search_nombre_con + "%";
    const apellCon = this.state.search_apell_con + "%";
    const cargo =
      this.state.search_cargo_con === ""
        ? "%"
        : this.state.search_cargo_con + "%";
    const email = "%";
    const pais = "%";
    const categoria = this.state.cat_org_api.map((obj) => obj.id);
    const subcat = categoria;

    const palabra1 = items[0];
    const palabra2 = items[1];
    const palabra3 = items[2];
    const palabra4 = this.state.search_cargo_con === "" ? items[0] : items[3];
    const palabra5 = items[0];
    const palabra6 = items[0];
    const palabra7 = items[6];
    const palabra8 = items[6];
    const palabra9 = "ilike";

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
      this.state.search_nombre_org !== "" ||
      this.state.search_nombre_con !== "" ||
      this.state.search_apell_con !== "" ||
      this.state.search_cargo_con !== ""
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
            this.setState({
              loadingDiag: false,
              contacts_api: data.contactos,
              reqText: false,
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({ loadingDiag: false });
      this.callApiCont();
    }
  };

  apiRefresh = () => {
    this.setState({ loadingDiag: true });
    if (
      this.state.search_nombre_org !== "" ||
      this.state.search_nombre_con !== "" ||
      this.state.search_apell_con !== "" ||
      this.state.search_cargo_con !== ""
    ) {
      this.apiSearch();
    } else {
      this.callApiCont();
    }
  };

  clearFunc = () => {
    this.setState(
      {
        loadingDiag: true,
        search_nombre_org: "",
        search_nombre_con: "",
        search_apell_con: "",
        search_cargo_con: "",
        reqText: false,
      },
      this.callApiCont()
    );
  };

  callApiPersona = () => {
    this.setState({ loadingDiag: true, contExist: false, addContact: true });
    const idCon = this.state.temp_id_con;
    this.setState({ temp_id_con: "" });
    fetch(process.env.REACT_APP_API_URL + "Contacto/" + idCon, {
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
        this.setState(
          {
            temp_nombre_con: data.contacto.nombres,
            temp_apell_con: data.contacto.apellidos,
            temp_cel_con: data.contacto.celular,
            temp_tipoid_con: data.contacto.tipo_documento_persona_id,
            temp_nid_con: data.contacto.numero_documento,
            temp_sex_con: data.contacto.sexo,
            //userUpdated_con: data.usuario_actualizacion.usuario_actualizacion,
            //fechaUpdated_con: data.contacto.updated_at,
            loadingDiag: false,
            temp_subcat_con:
              data.categorias[0] === this.state.indexCat ? [] : data.categorias,
          },
          this.subcatFake
        );
      })
      .catch((error) => {
        this.setState({ loadingDiag: false });
      });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;
    let checked = event.target.checked;

    switch (name) {
      case "input_nombre_con":
        this.setState({ temp_nombre_con: value });
        break;
      case "input_apell_con":
        this.setState({ temp_apell_con: value });
        break;
      case "input_cargo_con":
        this.setState({ temp_cargo_con: value });
        break;
      case "input_replegal_con":
        this.setState({ temp_replegal_con: checked });
        if (checked && this.state.temp_cargo_con === "") {
          this.setState({ temp_cargo_con: "Representante legal" });
        }
        break;
      case "input_tratodata_con":
        this.setState({ temp_tratodata_con: checked });
        break;
      case "input_enviodata_con":
        this.setState({ temp_enviodata_con: checked });
        break;
      case "input_tel_con":
        this.setState({ temp_tel_con: value });
        break;
      case "input_ext_con":
        this.setState({ temp_ext_con: value });
        break;
      case "input_cel_con":
        this.setState({ temp_cel_con: value });
        break;
      case "input_correo_con":
        this.setState({ temp_correo_con: value });
        break;
      case "input_correo2_con":
        this.setState({ temp_correo2_con: value });
        break;
      case "input_sex_con":
        this.setState({ temp_sex_con: value });
        break;
      case "input_obs_con":
        this.setState({ temp_obs_con: value });
        break;
      case "input_tipoid_con":
        this.setState({ temp_tipoid_con: value });
        break;
      case "input_nid_con":
        this.setState({ temp_nid_con: value });
        break;
      case "input_estado_con":
        this.setState({ temp_estado_con: value });
        break;
      case "input_idoffice_con":
        this.setState({ temp_idoffice_con: value }, () => {
          if (this.state.temp_tel_con === "") {
            this.setState({
              temp_tel_con: this.state.ofices_api[
                this.state.ofices_api.findIndex(
                  (x) => x.id === this.state.temp_idoffice_con
                )
              ].telefono_1,
            });
          }
        });
        break;
      case "input_search_nombre_org":
        this.setState({ search_nombre_org: value });
        break;
      case "input_search_nombre_con":
        this.setState({ search_nombre_con: value });
        break;
      case "input_search_apell_con":
        this.setState({ search_apell_con: value });
        break;
      case "input_search_cargo_con":
        this.setState({ search_cargo_con: value });
        break;
      default:
        break;
    }
  }

  handleChangeSubcat(event, value) {
    if (value[0] !== undefined) {
      const tempSubcat = value.map((obj) => obj.id);
      this.setState({
        temp_subcatFake_con: value,
        temp_subcat_con: tempSubcat,
      });
    } else {
      this.setState({ temp_subcatFake_con: value, temp_subcat_con: [] });
    }
  }

  render() {
    const BOX_SPACING = this.props.box_spacing;
    const BOX_SIZE_TABLE = this.props.box_size_table;

    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Lista de contactos</h3>
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
        <div className="o-contentForm-big-consultas">
          <TableContainer className="o-tableBase" style={{ marginTop: "1rem" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nombre</StyledTableCell>
                  <StyledTableCell>Cargo</StyledTableCell>
                  <StyledTableCell>Teléfono</StyledTableCell>
                  <StyledTableCell>Ext.</StyledTableCell>
                  <StyledTableCell>Celular</StyledTableCell>
                  <StyledTableCell>Correo</StyledTableCell>
                  <StyledTableCell>Observaciones</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.contacts.map((obj, i) => (
                  <TableRow key={i} hover={true}>
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
                              temp_id_con: obj.contacto_id,
                              temp_id_per: obj.persona_id,
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
                              temp_id_con: obj.contacto_id,
                              temp_id_per: obj.persona_id,
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
                {this.state.contacts[0] === undefined ? (
                  <TableRow>
                    <StyledTableCell>...</StyledTableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="o-btnAnadirTable" style={{ width: "10rem" }}>
            <BlueButton
              onClick={() => {
                this.setState({ contExist: true });
              }}
            >
              {"Añadir existente"}
            </BlueButton>
          </div>
          <div className="o-btnAnadirTable" style={{ marginLeft: "1rem" }}>
            <BlueButton
              onClick={() =>
                this.setState(
                  { temp_id_con: "", temp_id_per: "" },
                  this.handleClickOpen
                )
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
            to="/consultar_organizacion/editar"
            className="o-btnBotNav-btn"
          >
            <BlueButton>Volver</BlueButton>
          </Link>
        </div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.addContact}
          onClose={() => this.handleClose(false)}
          maxWidth={false}
        >
          <DialogTitle>
            <div className="o-row">
              Añadir contacto
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
            <div className="o-contentForm-big" style={{ margin: 0 }}>
              <div className="o-contentFormDiag">
                <h3 className="o-diagSubTittle">Datos básicos</h3>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <div className="o-dobleInput">
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      className="o-selectShort"
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        ID
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.temp_tipoid_con || ""}
                        onChange={this.handleChange}
                        label="ID"
                        name="input_tipoid_con"
                      >
                        <MenuItem
                          disabled={true}
                          value="input_tipoid_org"
                        ></MenuItem>
                        {this.state.tipoid_con_api.map((obj, i) => {
                          return (
                            <MenuItem key={i} value={obj.id}>
                              {obj.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className="o-inputShort">
                      <TextField
                        label="Número"
                        variant="outlined"
                        value={this.state.temp_nid_con || ""}
                        name="input_nid_con"
                        onChange={this.handleChange}
                        className="o-space"
                        margin="dense"
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label={
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Nombres"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    name="input_nombre_con"
                    value={this.state.temp_nombre_con || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                    error={
                      this.state.reqText && this.state.temp_nombre_con === ""
                    }
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label={
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Apellidos"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    name="input_apell_con"
                    value={this.state.temp_apell_con || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                    error={
                      this.state.reqText && this.state.temp_apell_con === ""
                    }
                  />
                </div>
                <FormControl variant="outlined" margin="dense">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Sexo
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_sex_con || ""}
                    onChange={this.handleChange}
                    label="Sexo"
                    name="input_sex_con"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem disabled={true} value="input_sex_con"></MenuItem>
                    {this.state.sex_con_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  label="Cargo"
                  variant="outlined"
                  name="input_cargo_con"
                  value={this.state.temp_cargo_con || ""}
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.temp_replegal_con || false}
                      color="primary"
                      name="input_replegal_con"
                      style={{
                        padding: "0.3rem",
                        marginLeft: "0.6rem",
                      }}
                      onChange={this.handleChange}
                    />
                  }
                  label="Representante legal"
                  margin="dense"
                />
                <FormControl
                  variant="outlined"
                  margin="dense"
                  error={
                    this.state.reqText && this.state.temp_estado_con === ""
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
                    value={this.state.temp_estado_con}
                    onChange={this.handleChange}
                    label="Estado*"
                    name="input_estado_con"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_estado_con"
                    ></MenuItem>
                    {this.state.estado_con_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <Autocomplete
                    multiple
                    style={{ maxWidth: "100%" }}
                    onChange={this.handleChangeSubcat}
                    options={this.state.subcat_con_api}
                    value={this.state.temp_subcatFake_con}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    disableCloseOnSelect
                    size="small"
                    limitTags={3}
                    disableClearable={true}
                    noOptionsText="..."
                    getOptionLabel={(option) => option.nombre}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        <div
                          style={{
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {option.nombre}
                        </div>
                      </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        margin="dense"
                        className="o-space"
                        label="Subcategorias"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="o-contentFormDiag">
                <h3 className="o-diagSubTittle">Ubicación</h3>
                <FormControl
                  className="o-space"
                  variant="outlined"
                  margin="dense"
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Oficina
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.temp_idoffice_con || ""}
                    onChange={this.handleChange}
                    label="Oficina"
                    name="input_idoffice_con"
                    className="o-space"
                    style={{ marginBottom: BOX_SPACING }}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_idoffice_con"
                    ></MenuItem>
                    {this.state.ofices_api.map((obj, i) => {
                      return (
                        <MenuItem key={i} value={obj.id}>
                          {obj.direccion} {obj.ciudad} - {obj.pais}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <h3 className="o-diagSubTittle2">Datos de contacto</h3>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Celular"
                    variant="outlined"
                    name="input_cel_con"
                    value={this.state.temp_cel_con || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <div className="o-dobleInput">
                    <div className="o-inputShort" style={{ marginLeft: 0 }}>
                      <TextField
                        label="Teléfono"
                        variant="outlined"
                        name="input_tel_con"
                        value={this.state.temp_tel_con || ""}
                        onChange={this.handleChange}
                        className="o-space"
                        margin="dense"
                      />
                    </div>
                    <div
                      className="o-selectShort"
                      style={{ marginLeft: "0.8rem", marginRight: 0 }}
                    >
                      <TextField
                        label="Ext."
                        variant="outlined"
                        name="input_ext_con"
                        value={this.state.temp_ext_con || ""}
                        onChange={this.handleChange}
                        className="o-space"
                        margin="dense"
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Correo"
                    variant="outlined"
                    name="input_correo_con"
                    value={this.state.temp_correo_con || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Correo alternativo"
                    variant="outlined"
                    name="input_correo2_con"
                    value={this.state.temp_correo2_con || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    id="outlined-textarea"
                    label="Observaciones"
                    value={this.state.temp_obs_con || ""}
                    multiline
                    rows={3}
                    variant="outlined"
                    name="input_obs_con"
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 0,
              }}
            >
              <FormControlLabel
                style={{ margin: 0 }}
                control={
                  <Checkbox
                    checked={this.state.temp_tratodata_con || false}
                    color="primary"
                    name="input_tratodata_con"
                    style={{
                      padding: "0 0.4rem",
                      marginLeft: "0.5rem",
                    }}
                    onChange={this.handleChange}
                  />
                }
                label="Autoriza manejo de información"
                margin="dense"
              />
              <FormControlLabel
                style={{ margin: 0 }}
                control={
                  <Checkbox
                    checked={this.state.temp_enviodata_con || false}
                    color="primary"
                    name="input_enviodata_con"
                    style={{
                      padding: "0 0.4rem",
                      marginLeft: "0.5rem",
                    }}
                    onChange={this.handleChange}
                  />
                }
                label="Autoriza envío de información"
                margin="dense"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
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
            </div>
          </DialogActions>
        </Dialog>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.delContact}
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
        <Dialog open={this.state.contExist} maxWidth={false}>
          <DialogTitle>
            <div className="o-row">
              <h3
                className="o-contentTittle-principal"
                style={{ fontWeight: 400, marginTop: "0.2rem" }}
              >
                {"Contactos existentes"}
              </h3>
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
          <DialogContent style={{ textAlign: "center" }}>
            <div className="o-diag-contactExist-big">
              <div className="o-consultas-containerInit">
                <div
                  className="o-consultas"
                  style={{ marginBottom: BOX_SPACING }}
                >
                  <TextField
                    label="Organización"
                    variant="outlined"
                    name="input_search_nombre_org"
                    value={this.state.search_nombre_org || ""}
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
                    name="input_search_nombre_con"
                    value={this.state.search_nombre_con || ""}
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
                    label="Apellidos"
                    variant="outlined"
                    name="input_search_apell_con"
                    value={this.state.search_apell_con || ""}
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
                <div
                  className="o-consultas"
                  style={{ marginBottom: BOX_SPACING, marginRight: 0 }}
                >
                  <TextField
                    label="Cargo"
                    variant="outlined"
                    name="input_search_cargo_con"
                    value={this.state.search_cargo_con || ""}
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
                </div>
              </div>
              <TableContainer
                className="o-tableBase-consultas"
                style={{ maxHeight: BOX_SIZE_TABLE }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Org.</StyledTableCell>
                      <StyledTableCell>Nombre</StyledTableCell>
                      <StyledTableCell>Cargo</StyledTableCell>
                      <StyledTableCell>Obser.</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.contacts_api.map((obj, i) => (
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
                          {obj.observaciones === null
                            ? emptyCell
                            : obj.observaciones}
                        </StyledTableCell>
                        <StyledTableCell
                          size="small"
                          style={{ paddingRight: "1rem" }}
                        >
                          <IconButton
                            size="small"
                            className="o-tinyBtn2"
                            color="primary"
                            onClick={() =>
                              this.setState(
                                {
                                  temp_id_per: obj.persona_id,
                                  temp_id_con: obj.contacto_id,
                                },
                                this.callApiPersona
                              )
                            }
                          >
                            <IconAddCircle />
                          </IconButton>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                    {this.state.contacts_api[0] === undefined ? (
                      <TableRow>
                        <StyledTableCell>...</StyledTableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: "flex-end" }}>
            <div className="o-btnBotNav-btnDiag2">
              <RedButton onClick={() => this.setState({ contExist: false })}>
                {"Cancelar"}
              </RedButton>
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
            {"(Puede que el contacto ya exista)"}
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

export default Consultar3Contactos;
