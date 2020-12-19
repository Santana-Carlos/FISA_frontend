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
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
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
      temp_cel_con: "",
      temp_correo_con: "",
      temp_obs_con: "",
      temp_tipoid_con: "",
      temp_nid_con: "",
      temp_sex_con: "",
      temp_estado_con: "",
      temp_subcat_con: [],
      temp_subcatFake_con: [],
      userUpdated_con: "",
      fechaUpdated_con: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOrg = this.handleChangeOrg.bind(this);
    this.handleChangeSubcat = this.handleChangeSubcat.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/auth/Contacto/Data", {
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
    this.callApiOrg();
  }

  callApiOrg = () => {
    fetch("http://localhost:8000/api/auth/Organizacion/SimpList", {
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
    fetch("http://localhost:8000/api/auth/Contacto/" + idCon, {
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
            temp_tel_con: data.contacto.telefono,
            temp_cel_con: data.contacto.celular,
            temp_correo_con: data.contacto.email,
            temp_obs_con: data.contacto.observaciones,
            temp_tipoid_con: data.contacto.tipo_documento_persona_id,
            temp_nid_con: data.contacto.numero_documento,
            temp_sex_con: data.contacto.sexo,
            temp_estado_con: data.contacto.estado,
            userUpdated_con: data.usuario_actualizacion.usuario_actualizacion,
            fechaUpdated_con: data.contacto.updated_at,
            temp_subcat_con:
              data.categorias[0] === this.state.indexCat ? [] : data.categorias,
          },
          this.dataFake
        );
      })
      .catch((error) => {});
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
    fetch("http://localhost:8000/api/auth/Oficina/Org", {
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
    const idCon = this.props.temp_id_con;
    const data = {
      organizacion_id: this.state.dbid_org,
      oficina_id: this.state.temp_idoffice_con,
      nombres: this.state.temp_nombre_con,
      apellidos: this.state.temp_apell_con,
      cargo: this.state.temp_cargo_con,
      representante: this.state.temp_replegal_con,
      telefono: this.state.temp_tel_con,
      celular: this.state.temp_cel_con,
      email: this.state.temp_correo_con,
      estado: this.state.temp_estado_con,
      observaciones: this.state.temp_obs_con,
      tipo_documento_persona_id: this.state.temp_tipoid_con,
      numero_documento: this.state.temp_nid_con,
      sexo: this.state.temp_sex_con,
    };
    fetch("http://localhost:8000/api/auth/Contacto/" + idCon, {
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
          this.setState(
            {
              reqText: false,
              temp_id_con: data.contacto.id,
            },
            this.delSubcatApi
          );
        }
      })
      .catch((error) => {
        this.setState({ reqText: true, createS: true });
      });
  };

  delSubcatApi = () => {
    const tempSubcat = {
      contacto_id: this.state.temp_id_con,
    };
    console.log(tempSubcat);
    fetch("http://localhost:8000/api/auth/Contacto/DelSub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(tempSubcat),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    if (this.state.temp_subcat_con[0] !== undefined) {
      this.addSubcatApi();
    }
  };

  addSubcatApi = () => {
    const tempSubcat = {
      contacto_id: this.state.temp_id_con,
      categorias: this.state.temp_subcat_con,
    };
    console.log(tempSubcat);
    fetch("http://localhost:8000/api/auth/CategoriaContacto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(tempSubcat),
    })
      .then((response) => {
        this.setState({ addContact: false, reqText: false, temp_id_con: "" });
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
    setTimeout(this.callApi, 10000);
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
      temp_tel_con: "",
      temp_cel_con: "",
      temp_correo_con: "",
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
        this.setState({ temp_idoffice_con: value });
        break;
      default:
        break;
    }
  }

  handleChangeOrg(event, value) {
    if (value === null) {
      this.setState({ dbidFake_org: value, ofices_api: [] });
    } else {
      this.setState(
        { dbidFake_org: value, dbid_org: value.id },
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
    const BOX_SPACING = window.innerHeight > 900 ? "0.4rem" : "0rem";
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
                value={this.state.temp_sex_con}
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
          <div style={{ color: "#FFFFFF" }}>{"Me encontraste!"}</div>
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
            {"(Puede que el contacto ya exista, los correos deben ser únicos)"}
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
