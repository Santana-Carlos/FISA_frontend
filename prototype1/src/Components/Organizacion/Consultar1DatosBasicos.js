import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  BlueButton,
  GreenButton,
  CustomAutocomplete as Autocomplete,
} from "../Buttons";
import "../Styles.css";
import { Link } from "react-router-dom";

class Consultar1DatosBasicos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      reqText: false,
      createS: false,
      nueva_org: false,
      tipoid_org: "",
      nid_org: "",
      cat_org: "",
      nomcom_org: "",
      razsoc_org: "",
      pais_org: "",
      web_org: "",
      obs_org: "",
      fechaafi_org: "",
      fechaUpdated_org: "",
      userUpdated_org: "",
      motivoafi_org: "",
      fechadesafi_org: "",
      motivodesafi_org: "",
      tipo_org: "",
      clase_org: "",
      sectoreco_org: "",
      subsececo_org: "",
      empdir_org: "",
      empind_org: "",
      estado_org: "",
      ciiu_org: [],
      ciiuFake_org: [],
      tipoid_org_api: [],
      cat_org_api: [],
      pais_org_api: [],
      tipo_org_api: [],
      clase_org_api: [],
      sectoreco_org_api: [],
      subsececo_org_api: [],
      estado_org_api: [
        {
          id: true,
          nombre: "ACTIVO",
        },
        {
          id: false,
          nombre: "INACTIVO",
        },
      ],
      ciiu_org_api: [],
      dbid_org: "",
      indexCat: -1,
      loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCiiu = this.handleChangeCiiu.bind(this);
  }

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
        this.setState(
          {
            tipoid_org_api: data.documentos,
            cat_org_api: data.categorias,
            pais_org_api: data.paises,
            tipo_org_api: data.tipos,
            clase_org_api: data.clases,
            sectoreco_org_api: data.sectores,
            ciiu_org_api: data.ciius,
          },
          () => {
            this.setState({
              indexCat: this.state.cat_org_api[
                this.state.cat_org_api.findIndex(
                  (x) =>
                    x.nombre.includes("DESAFILIADO") ||
                    x.nombre.includes("desafiliado")
                )
              ].id,
            });
          }
        );
      })
      .catch((error) => {});
    this.callApi();
  }

  callApi = () => {
    const idOrg = this.props.dbid_org;
    fetch(process.env.REACT_APP_API_URL + "Organizacion/" + idOrg, {
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
            tipoid_org: data.organizacion.tipo_documento_organizacion_id,
            nid_org: data.organizacion.numero_documento,
            cat_org: data.organizacion.categoria_id,
            nomcom_org: data.organizacion.nombre,
            razsoc_org: data.organizacion.razon_social,
            pais_org: data.organizacion.pais_id,
            web_org: data.organizacion.pagina_web,
            obs_org: data.organizacion.observaciones,
            fechaafi_org: data.organizacion.fecha_afiliacion,
            fechaUpdated_org: data.organizacion.updated_at,
            userUpdated_org: data.usuario_actualizacion.usuario_actualizacion,
            motivoafi_org: data.organizacion.motivo_afiliacion,
            fechadesafi_org: data.organizacion.fecha_desafiliacion,
            motivodesafi_org: data.organizacion.motivo_desafiliacion,
            tipo_org: data.organizacion.tipo_organizacion_id,
            clase_org: data.organizacion.clase_id,
            sectoreco_org: data.organizacion.sector_id,
            subsececo_org: data.organizacion.subsector_id,
            empdir_org: data.organizacion.empleados_directos,
            empind_org: data.organizacion.empleados_indirectos,
            estado_org: data.organizacion.estado,
            ciiu_org: data.actividades,
            loading: false,
          },
          this.callApiSubsector
        );
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiSubsector = () => {
    const data = {
      sector_id: this.state.sectoreco_org,
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
          subsececo_org_api: data.subsectores,
        });
      })
      .catch((error) => {});
    const tempCiiuApi = this.state.ciiu_org_api;
    const tempFake = tempCiiuApi.filter((obj) => {
      for (let j = 0; j < this.state.ciiu_org.length; j++) {
        if (obj.id === this.state.ciiu_org[j]) {
          return true;
        }
      }
      return false;
    });
    this.setState({ ciiuFake_org: tempFake });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_tipoid_org":
        this.setState({ tipoid_org: value, tipoid2_org: value });
        break;
      case "input_nid_org":
        this.setState({ nid_org: value, nid2_org: value });
        break;
      case "input_cat_org":
        this.setState({ cat_org: value }, () => {
          if (this.state.indexCat !== this.state.cat_org) {
            this.setState({ fechadesafi_org: "", motivodesafi_org: "" });
          }
        });
        break;
      case "input_nomcom_org":
        this.setState({ nomcom_org: value });
        break;
      case "input_razsoc_org":
        this.setState({ razsoc_org: value });
        break;
      case "input_pais_org":
        this.setState({ pais_org: value });
        break;
      case "input_web_org":
        this.setState({ web_org: value });
        break;
      case "input_obs_org":
        this.setState({ obs_org: value });
        break;
      case "input_motivoafi_org":
        this.setState({ motivoafi_org: value });
        break;
      case "input_motivodesafi_org":
        this.setState({ motivodesafi_org: value });
        break;
      case "input_tipo_org":
        this.setState({ tipo_org: value });
        break;
      case "input_clase_org":
        this.setState({ clase_org: value });
        break;
      case "input_sectoreco_org":
        this.setState(
          { sectoreco_org: value, subsececo_org: "" },
          this.callApiSubsector
        );
        break;
      case "input_subsececo_org":
        this.setState({ subsececo_org: value });
        break;
      case "input_empdir_org":
        this.setState({ empdir_org: value });
        break;
      case "input_empind_org":
        this.setState({ empind_org: value });
        break;
      case "input_estado_org":
        this.setState({ estado_org: value });
        break;
      default:
        break;
    }
  }

  handleChangeCiiu(event, value) {
    if (value[0] !== undefined) {
      const tempCiiu = value.map((obj) => obj.id);
      this.setState({ ciiuFake_org: value, ciiu_org: tempCiiu });
    } else {
      this.setState({ ciiuFake_org: value, ciiu_org: [] });
    }
  }

  handleDateAfi = (date) => {
    if (date !== null && date !== "") {
      date.setHours(12);
      this.setState({ fechaafi_org: date });
    } else {
      this.setState({ fechaafi_org: "" });
    }
  };

  handleDateDesafi = (date) => {
    if (date !== null && date !== "") {
      date.setHours(12);
      this.setState({ fechadesafi_org: date });
    } else {
      this.setState({ fechadesafi_org: "" });
    }
  };

  apiPost = () => {
    this.setState({ loading: true });
    const idOrg = this.props.dbid_org;
    const data = {
      nombre: this.state.nomcom_org,
      tipo_documento_organizacion_id: this.state.tipoid_org,
      numero_documento: this.state.nid_org,
      razon_social: this.state.razsoc_org,
      categoria_id: this.state.cat_org,
      fecha_afiliacion: this.state.fechaafi_org,
      empleados_directos: this.state.empdir_org,
      empleados_indirectos: this.state.empind_org,
      motivo_afiliacion: this.state.motivoafi_org,
      fecha_desafiliacion: this.state.fechadesafi_org,
      motivo_desafiliacion: this.state.motivodesafi_org,
      observaciones: this.state.obs_org,
      pagina_web: this.state.web_org,
      pais_id: this.state.pais_org,
      tipo_organizacion_id: this.state.tipo_org,
      clase_id: this.state.clase_org,
      sector_id: this.state.sectoreco_org,
      subsector_id: this.state.subsececo_org,
      estado: this.state.estado_org,
      actividades: this.state.ciiu_org,
    };
    fetch(process.env.REACT_APP_API_URL + "Organizacion/" + idOrg, {
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
        if (data.success) {
          this.setState({ reqText: false, loading: false });
        }
      })
      .catch((error) => {
        this.setState({ loading: false, createS: true, reqText: true });
      });
  };

  render() {
    const BOX_SPACING = this.props.box_spacing;
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">{"Datos básicos"}</h3>
          <h4 className="o-contentTittle-sub">
            {"campos marcados con * son obligatorios"}
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
            {"Organización: "}
            {this.props.name_org || ""}
          </div>
        </div>
        <div className="o-contentForm-big">
          <div className="o-contentForm">
            <div style={{ marginBottom: BOX_SPACING }}>
              <div className="o-dobleInput">
                <FormControl
                  variant="outlined"
                  margin="dense"
                  className="o-selectShort"
                  error={this.state.reqText && this.state.tipoid_org === ""}
                >
                  <InputLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {"ID"}
                      <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                        {"*"}
                      </div>
                    </div>
                  </InputLabel>
                  <Select
                    value={this.state.tipoid_org || ""}
                    onChange={this.handleChange}
                    label="ID*"
                    name="input_tipoid_org"
                  >
                    {this.state.tipoid_org_api.map((obj, i) => {
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
                    label={
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Número"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
                    variant="outlined"
                    value={this.state.nid_org || ""}
                    name="input_nid_org"
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                    error={this.state.reqText && this.state.nid_org === ""}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label={
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {"Nombre comercial"}
                    <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                      {"*"}
                    </div>
                  </div>
                }
                variant="outlined"
                name="input_nomcom_org"
                value={this.state.nomcom_org || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
                error={this.state.reqText && this.state.nomcom_org === ""}
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
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
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
              error={this.state.reqText && this.state.cat_org === ""}
            >
              <InputLabel>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {"Categoría"}
                  <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                    {"*"}
                  </div>
                </div>
              </InputLabel>
              <Select
                value={this.state.cat_org || ""}
                onChange={this.handleChange}
                label="Categoría*"
                name="input_cat_org"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.cat_org_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              style={{ maxWidth: "100%" }}
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
                style={{ marginBottom: BOX_SPACING }}
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
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel>Tipo organización</InputLabel>
              <Select
                value={this.state.tipo_org || ""}
                onChange={this.handleChange}
                label="Tipo organización"
                name="input_tipo_org"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.tipo_org_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Observaciones"
                value={this.state.obs_org || ""}
                multiline
                rows={2}
                variant="outlined"
                name="input_obs_org"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
          </div>

          <div className="o-contentForm">
            <FormControl
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel>Clase organización</InputLabel>
              <Select
                value={this.state.clase_org || ""}
                onChange={this.handleChange}
                label="Clase organización"
                name="input_clase_org"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.clase_org_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel>Sector económico</InputLabel>
              <Select
                value={this.state.sectoreco_org || ""}
                onChange={this.handleChange}
                label="Sector económico"
                name="input_sectoreco_org"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.sectoreco_org_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
              disabled={this.state.sectoreco_org === ""}
            >
              <InputLabel>Subsector económico</InputLabel>
              <Select
                value={this.state.subsececo_org || ""}
                onChange={this.handleChange}
                label="Subsector económico"
                name="input_subsececo_org"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.subsececo_org_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Empleados directos"
                variant="outlined"
                name="input_empdir_org"
                value={this.state.empdir_org || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Empleados indirectos"
                variant="outlined"
                name="input_empind_org"
                value={this.state.empind_org || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="dense"
                  label="Fecha afiliacion"
                  value={this.state.fechaafi_org || null}
                  onChange={this.handleDateAfi}
                  className="o-space"
                  invalidDateMessage={"Fecha inválida"}
                  autoOk={true}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Motivo afiliación"
                value={this.state.motivoafi_org || ""}
                multiline
                rows={2}
                variant="outlined"
                name="input_motivoafi_org"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
          </div>

          <div className="o-contentForm">
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Página web"
                variant="outlined"
                name="input_web_org"
                value={this.state.web_org || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <FormControl
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
              error={this.state.reqText && this.state.estado_org === ""}
            >
              <InputLabel>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {"Estado"}
                  <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                    {"*"}
                  </div>
                </div>
              </InputLabel>
              <Select
                value={this.state.estado_org}
                onChange={this.handleChange}
                label="Estado*"
                name="input_estado_org"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                {this.state.estado_org_api.map((obj, i) => {
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
                onChange={this.handleChangeCiiu}
                options={this.state.ciiu_org_api}
                value={this.state.ciiuFake_org}
                getOptionSelected={(option, value) =>
                  option.codigo === value.codigo
                }
                disableCloseOnSelect
                size="small"
                limitTags={3}
                disableClearable={true}
                noOptionsText="..."
                getOptionLabel={(option) =>
                  option.codigo + " - " + option.nombre
                }
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
                      {option.codigo + " - " + option.nombre}
                    </div>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    margin="dense"
                    className="o-space"
                    label="CIIU"
                  />
                )}
              />
            </div>
            {this.state.indexCat === this.state.cat_org ? (
              <div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      inputVariant="outlined"
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="dense"
                      label="Fecha desafiliación"
                      value={this.state.fechadesafi_org || null}
                      onChange={this.handleDateDesafi}
                      className="o-space"
                      invalidDateMessage={"Fecha inválida"}
                      autoOk={true}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div style={{ marginBottom: BOX_SPACING }}>
                  <TextField
                    label="Motivo desafiliación"
                    value={this.state.motivodesafi_org || ""}
                    multiline
                    rows={2}
                    variant="outlined"
                    name="input_motivodesafi_org"
                    onChange={this.handleChange}
                    className="o-space"
                    margin="dense"
                  />
                </div>
              </div>
            ) : null}
            <div className="o-textMain" style={{ fontSize: "1rem" }}>
              {"Última actualización:"}
              <div className="o-textSub">
                {this.state.userUpdated_org || ""}
                {" - "}
                {this.state.fechaUpdated_org || ""}
              </div>
            </div>
          </div>
        </div>
        <div className="o-btnBotNav">
          <div className="o-btnBotNavDoble">
            <div className="o-btnBotNav-btn">
              <GreenButton onClick={this.apiPost}>Guardar</GreenButton>
            </div>
            <Link
              exact={"true"}
              to="/consultar_organizacion/editar"
              className="o-btnBotNav-btn"
            >
              <BlueButton>{"Volver"}</BlueButton>
            </Link>
          </div>
        </div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.createS}
          maxWidth={false}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            {"Datos inválidos o insuficientes"}
          </DialogTitle>
          <DialogContent>
            {
              "Puede haber superado el número máximo de caracteres en algún campo"
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

export default Consultar1DatosBasicos;
