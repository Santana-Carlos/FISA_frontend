import React, { Component } from "react";
import {
  InputLabel,
  FormControlLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  IconButton,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  GreenButton,
  RedButton,
  BlueButton,
  StyledTableCellTiny as StyledTableCell,
} from "../Buttons";
import {
  AddCircleOutline as IconAdd,
  Refresh as IconRefresh,
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

class CrearContacto extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      dbid_org: "",
      dbidFake_org: null,
      createS: false,
      contExist: false,
      reqText: false,
      orgSelect: false,
      temp_id_per: "",
      contacts: [],
      addContact: false,
      delContact: false,
      tipoid_con_api: [],
      subcat_con_api: [],
      ofices_api: [],
      orgs_api: [],
      sex_con_api: ["Masculino", "Femenino", "Otro"],
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
      temp_tel_con: "",
      temp_ext_con: "",
      temp_cel_con: "",
      temp_correo_con: "",
      temp_obs_con: "",
      temp_tipoid_con: "",
      temp_nid_con: "",
      temp_sex_con: "",
      temp_estado_con: "",
      temp_subcat_con: [],
      temp_subcatFake_con: [],
      search_nombre_org: "",
      search_nombre_con: "",
      search_apell_con: "",
      search_cargo_con: "",
      cat_org_api: [],
      loading: false,
      loadingDiag: false,
      box_spacing: window.innerHeight > 900 ? "0.4rem" : "0rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOrg = this.handleChangeOrg.bind(this);
    this.handleChangeSubcat = this.handleChangeSubcat.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.4rem" : "0rem",
      box_size_table: window.innerHeight > 900 ? "30rem" : "15rem",
    });
  };

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
    this.setState({
      winInterval: window.setInterval(this.resizeBox, 1000),
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.winInterval);
  }

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
            contacts: data.contactos,
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

  callApipostContacto = () => {
    this.setState({ loading: true });
    const data = {
      persona_id: this.state.temp_id_per,
      organizacion_id: this.state.dbid_org,
      oficina_id: this.state.temp_idoffice_con,
      nombres: this.state.temp_nombre_con,
      apellidos: this.state.temp_apell_con,
      cargo: this.state.temp_cargo_con,
      representante: this.state.temp_replegal_con,
      telefono: this.state.temp_tel_con,
      extension: this.state.temp_ext_con,
      celular: this.state.temp_cel_con,
      email: this.state.temp_correo_con,
      estado: this.state.temp_estado_con,
      observaciones: this.state.temp_obs_con,
      tipo_documento_persona_id: this.state.temp_tipoid_con,
      numero_documento: this.state.temp_nid_con,
      sexo: this.state.temp_sex_con,
      categorias: this.state.temp_subcat_con,
    };
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
          this.setState(
            {
              loading: false,
              reqText: false,
            },
            this.delSubcatApi
          );
          this.clearTemp();
        }
      })
      .catch((error) => {
        this.setState({ loading: false, reqText: true, createS: true });
      });
  };

  clearTemp = () => {
    this.setState({
      dbid_org: "",
      dbidFake_org: null,
      temp_id_con: "",
      temp_id_per: "",
      temp_idoffice_con: "",
      temp_nombre_con: "",
      temp_apell_con: "",
      temp_cargo_con: "",
      temp_replegal_con: false,
      temp_tel_con: "",
      temp_ext_con: "",
      temp_cel_con: "",
      temp_correo_con: "",
      temp_obs_con: "",
      temp_tipoid_con: "",
      temp_nid_con: "",
      temp_sex_con: "",
      temp_subcat_con: [],
      temp_subcatFake_con: [],
      temp_estado_con: "",
      subcatSearch: "",
      reqText: false,
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
              contacts: data.contactos,
              reqText: false,
            });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({ loadingDiag: false, reqText: true, createS: true });
      this.callAPi();
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
    this.setState({ loading: true, contExist: false });
    const idCon = this.state.temp_id_con;
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
            loading: false,
            temp_subcat_con:
              data.categorias[0] === this.state.indexCat ? [] : data.categorias,
          },
          this.dataFake
        );
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  dataFake = () => {
    const tempSubcat = this.state.subcat_con_api;
    const tempSubFake = tempSubcat.filter((obj) => {
      for (let j = 0; j < this.state.temp_subcat_con.length; j++) {
        if (obj.id === this.state.temp_subcat_con[j]) {
          return true;
        }
      }
      return false;
    });
    this.setState({
      temp_subcatFake_con: tempSubFake,
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

  handleChangeOrg(event, value) {
    if (value === null) {
      this.setState({
        dbidFake_org: value,
        ofices_api: [],
        temp_idoffice_con: "",
      });
    } else {
      this.setState(
        { dbidFake_org: value, dbid_org: value.id, temp_idoffice_con: "" },
        this.callAPiOff
      );
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
    const BOX_SPACING = this.state.box_spacing;
    const BOX_SIZE_TABLE = this.state.box_size_table;
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Crear contacto</h3>
          <h4 className="o-contentTittle-sub">
            campos marcados con * son obligatorios
          </h4>
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
        <div className="o-contentForm-big">
          <div className="o-contentForm">
            <h3 className="o-innerSubTittle">Datos básicos</h3>
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
                  style={{ marginBottom: BOX_SPACING }}
                >
                  <MenuItem disabled={true} value="input_tipoid_con"></MenuItem>
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
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Nombres*"
                variant="outlined"
                name="input_nombre_con"
                value={this.state.temp_nombre_con || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
                error={this.state.reqText && this.state.temp_nombre_con === ""}
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Apellidos*"
                variant="outlined"
                name="input_apell_con"
                value={this.state.temp_apell_con || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
                error={this.state.reqText && this.state.temp_apell_con === ""}
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
                    <MenuItem key={i} value={obj}>
                      {obj}
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
                  style={{ marginLeft: "0.6rem" }}
                  onChange={this.handleChange}
                />
              }
              label="Representante legal"
              margin="dense"
            />
          </div>

          <div className="o-contentForm">
            <h3 className="o-innerSubTittle">Ubicación</h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <Autocomplete
                value={this.state.dbidFake_org}
                onChange={this.handleChangeOrg}
                options={this.state.orgs_api || []}
                getOptionLabel={(option) => option.nombre}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Organización*"
                    margin="dense"
                    className="o-space"
                    variant="outlined"
                    error={
                      this.state.reqText && this.state.dbidFake_org === null
                    }
                  />
                )}
              />
            </div>

            <FormControl className="o-space" variant="outlined" margin="dense">
              <InputLabel id="demo-simple-select-outlined-label">
                Oficina
              </InputLabel>
              <Select
                disabled={this.state.dbid_org === ""}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.temp_idoffice_con || ""}
                onChange={this.handleChange}
                label="Oficina*"
                name="input_idoffice_con"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                <MenuItem disabled={true} value="input_idoffice_con"></MenuItem>
                {this.state.ofices_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.direccion} {obj.ciudad} - {obj.pais}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <h3 className="o-innerSubTittle2">Datos de contacto</h3>
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
          </div>

          <div className="o-contentForm">
            <h3 className="o-innerSubTittle">Otros datos</h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                id="outlined-textarea"
                label="Observaciones"
                value={this.state.temp_obs_con || ""}
                multiline
                rows={2}
                variant="outlined"
                name="input_obs_con"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <FormControl
              variant="outlined"
              margin="dense"
              error={this.state.reqText && this.state.temp_estado_con === ""}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Estado*
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
                <MenuItem disabled={true} value="input_estado_con"></MenuItem>
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
                getOptionSelected={(option, value) => option.id === value.id}
                disableCloseOnSelect
                size="small"
                limitTags={3}
                disableClearable={true}
                noOptionsText="..."
                getOptionLabel={(option) => option.nombre}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
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
        </div>
        <div className="o-btnBotNav">
          <div className="o-btnBotNav-btn" style={{ width: "10rem" }}>
            <BlueButton
              onClick={() => {
                this.setState({ contExist: true });
              }}
            >
              {"Añadir existente"}
            </BlueButton>
          </div>
          <div className="o-btnBotNavDoble">
            <div className="o-btnBotNav-btn">
              <RedButton onClick={this.clearTemp}>{"Limpiar"}</RedButton>
            </div>
            <div className="o-btnBotNav-btn">
              <GreenButton onClick={this.callApipostContacto}>
                {"Guardar"}
              </GreenButton>
            </div>
          </div>
        </div>
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
                            <IconAdd />
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
        <Dialog open={this.state.createS} maxWidth={false}>
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

export default CrearContacto;
