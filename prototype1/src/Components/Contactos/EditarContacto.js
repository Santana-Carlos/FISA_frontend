import React, { Component } from "react";
import {
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
  Checkbox,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import { MuiTriStateCheckbox as CheckboxTri } from "mui-tri-state-checkbox";
import { Autocomplete } from "@material-ui/lab";
import {
  CheckBoxOutlineBlank,
  IndeterminateCheckBox,
} from "@material-ui/icons";
import { GreenButton, BlueButton } from "../Buttons";
import { Link, Redirect } from "react-router-dom";
import "../Styles.css";

class EditarContacto extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      dbid_org: "",
      dbidFake_org: null,
      createS: false,
      reqText: false,
      orgSelect: false,
      temp_id_con: props.temp_id_con,
      temp_id_per: props.temp_id_per,
      contacts: [],
      delContact: false,
      tipoid_con_api: [],
      subcat_con_api: [],
      ofices_api: [],
      orgs_api: [],
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
      temp_tratodata_con: null,
      temp_enviodata_con: null,
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
      userUpdated_con: "",
      fechaUpdated_con: "",
      loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOrg = this.handleChangeOrg.bind(this);
    this.handleChangeSubcat = this.handleChangeSubcat.bind(this);
  }

  componentDidMount() {
    if (this.props.temp_id_con === "") {
      return null;
    }
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
    this.callApiOrg();
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
        this.setState(
          {
            orgs_api: data.organizaciones,
          },
          this.callApi
        );
      })
      .catch((error) => {});
  };

  callApi = () => {
    const idCon = this.props.temp_id_con;
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
            dbid_org: data.contacto.organizacion_id,
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
            userUpdated_con: data.usuario_actualizacion.usuario,
            fechaUpdated_con: data.contacto.updated_at,
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
    const tempOrg = this.state.orgs_api;
    const tempSubcat = this.state.subcat_con_api;
    const tempOrgFake = tempOrg.filter((obj) => obj.id === this.state.dbid_org);
    const tempSubFake = tempSubcat.filter((obj) => {
      for (let j = 0; j < this.state.temp_subcat_con.length; j++) {
        if (obj.id === this.state.temp_subcat_con[j]) {
          return true;
        }
      }
      return false;
    });
    this.setState(
      {
        temp_subcatFake_con: tempSubFake,
        dbidFake_org: tempOrgFake[0],
      },
      this.callAPiOff
    );
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

  callApiPutContacto = () => {
    this.setState({ loading: true });
    const idCon = this.props.temp_id_con;
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
        if (data.success) {
          this.setState({
            loading: false,
            reqText: false,
          });
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
      temp_idoffice_con: "",
      temp_nombre_con: "",
      temp_apell_con: "",
      temp_cargo_con: "",
      temp_replegal_con: false,
      temp_tratodata_con: null,
      temp_enviodata_con: null,
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
      fechaUpdated_con: "",
      userUpdated_con: "",
      temp_estado_con: "",
      subcatSearch: "",
    });
  };

  handleChange(event, value2) {
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
        this.setState({ temp_tratodata_con: value2 });
        break;
      case "input_enviodata_con":
        this.setState({ temp_enviodata_con: value2 });
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
          if (
            this.state.temp_tel_con === "" ||
            this.state.temp_tel_con === null
          ) {
            this.setState({
              temp_tel_con:
                this.state.ofices_api[
                  this.state.ofices_api.findIndex(
                    (x) => x.id === this.state.temp_idoffice_con
                  )
                ].telefono_1,
            });
          }
        });
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
    const BOX_SPACING = this.props.box_spacing;
    return (
      <div className="o-cardContent">
        {this.props.temp_id_con === "" ? (
          <Redirect exact={"true"} to="/consultar_contacto" />
        ) : null}
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Editar contacto</h3>
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
                <InputLabel>ID</InputLabel>
                <Select
                  value={this.state.temp_tipoid_con || ""}
                  onChange={this.handleChange}
                  label="ID"
                  name="input_tipoid_con"
                  style={{ marginBottom: BOX_SPACING }}
                >
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
                error={this.state.reqText && this.state.temp_nombre_con === ""}
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
                error={this.state.reqText && this.state.temp_apell_con === ""}
              />
            </div>
            <FormControl variant="outlined" margin="dense">
              <InputLabel>Sexo</InputLabel>
              <Select
                value={this.state.temp_sex_con || ""}
                onChange={this.handleChange}
                label="Sexo"
                name="input_sex_con"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
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
                    label={
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {"Organización"}
                        <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                          {"*"}
                        </div>
                      </div>
                    }
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
              <InputLabel>Oficina</InputLabel>
              <Select
                disabled={this.state.dbid_org === ""}
                value={this.state.temp_idoffice_con || ""}
                onChange={this.handleChange}
                label="Oficina"
                name="input_idoffice_con"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
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
          </div>

          <div className="o-contentForm">
            <h3 className="o-innerSubTittle">Otros datos</h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
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
              <InputLabel>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {"Estado"}
                  <div style={{ color: "#FF0000", marginLeft: "0.1rem" }}>
                    {"*"}
                  </div>
                </div>
              </InputLabel>
              <Select
                value={this.state.temp_estado_con}
                onChange={this.handleChange}
                label="Estado*"
                name="input_estado_con"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
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
                getOptionLabel={(option) =>
                  option.nombre.length > 20
                    ? option.nombre.substring(0, 20) + "..."
                    : option.nombre
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
            <div className="o-textMain" style={{ fontSize: "1rem" }}>
              {"Última actualización:"}
              <div className="o-textSub">
                {this.state.userUpdated_con || ""}
                {" - "}
                {this.state.fechaUpdated_con || ""}
              </div>
            </div>
          </div>
        </div>
        <div className="o-btnBotNav">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 0,
            }}
          >
            <FormControlLabel
              style={{ margin: "0 0 0.1rem 0.5rem" }}
              control={
                <CheckboxTri
                  checked={this.state.temp_tratodata_con}
                  icon={<IndeterminateCheckBox color="secondary" />}
                  indeterminateIcon={<CheckBoxOutlineBlank />}
                  color="primary"
                  name="input_tratodata_con"
                  style={{
                    padding: 0,
                    margin: "0 0.3rem 0 0",
                  }}
                  onChange={this.handleChange}
                />
              }
              label="Autoriza manejo de información"
              margin="dense"
            />
            <FormControlLabel
              style={{ margin: "0 0 0 0.5rem" }}
              control={
                <CheckboxTri
                  checked={this.state.temp_enviodata_con}
                  icon={<IndeterminateCheckBox color="secondary" />}
                  indeterminateIcon={<CheckBoxOutlineBlank />}
                  color="primary"
                  name="input_enviodata_con"
                  style={{
                    padding: 0,
                    margin: "0 0.3rem 0 0",
                  }}
                  onChange={this.handleChange}
                />
              }
              label="Autoriza envío de información"
              margin="dense"
            />
          </div>
          <div className="o-btnBotNavDoble">
            <div className="o-btnBotNav-btn">
              <GreenButton onClick={this.callApiPutContacto}>
                {"Guardar"}
              </GreenButton>
            </div>
            <Link
              exact={"true"}
              to="/consultar_contacto"
              className="o-btnBotNav-btn"
            >
              <BlueButton>{"Volver"}</BlueButton>
            </Link>
          </div>
        </div>
        <Dialog open={this.state.createS} maxWidth={false}>
          <DialogTitle style={{ textAlign: "center" }}>
            {"Datos inválidos o insuficientes"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
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

export default EditarContacto;
