import React, { Component } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  Checkbox,
} from "@material-ui/core";
import { Edit as IconEdit } from "@material-ui/icons";
import {
  BlueButton,
  GreenButton,
  RedButton,
  CustomChip as Chip,
} from "../Buttons";
import { Link } from "react-router-dom";
import "../Styles.css";

class Consultar4Finanzas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      dbid_org: props.dbid_org,
      openInter: false,
      createS: false,
      temp_id_fin: "",
      temp_ingope_fin: "",
      temp_ingnoo_fin: "",
      temp_totaling_fin: "",
      temp_egrope_fin: "",
      temp_egrnoo_fin: "",
      temp_totalegr_fin: "",
      temp_totalact_fin: "",
      temp_totalpas_fin: "",
      temp_clas_fin: "",
      temp_regimen_fin: "",
      temp_ventas_fin: "",
      temp_totalpat_fin: "",
      temp_anodec_fin: "",
      temp_cuorealano_fin: "",
      temp_cuorealafi_fin: "",
      userUpdated: "",
      fechaUpdated: "",
      temp_import_fin: [],
      temp_export_fin: [],
      temp_anocuota_fin: "",
      temp_cuotaanual_fin: "",
      clas_fin_api: [],
      regimen_fin_api: [],
      pais_fin_api: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/auth/InformacionFinanciera/Data", {
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
          clas_fin_api: data.clasificaciones,
          regimen_fin_api: data.regimenes,
          pais_fin_api: data.paises,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    this.callApi();
  }

  callApi = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch("http://localhost:8000/api/auth/InformacionFinanciera/Org", {
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
            temp_id_fin: data.informacion.id,
            temp_ingope_fin: data.informacion.ingresos_operacionales,
            temp_ingnoo_fin: data.informacion.ingresos_no_operacionales,
            temp_totaling_fin: data.informacion.ingresos_anuales,
            temp_egrope_fin: data.informacion.egresos_operacionales,
            temp_egrnoo_fin: data.informacion.egresos_no_operacionales,
            temp_totalegr_fin: data.informacion.egresos_anuales,
            temp_totalact_fin: data.informacion.total_activos,
            temp_totalpas_fin: data.informacion.total_pasivos,
            temp_clas_fin: data.informacion.clasificacion_id,
            temp_regimen_fin: data.informacion.regimen_id,
            temp_ventas_fin: data.informacion.ventas_anuales,
            temp_totalpat_fin: data.informacion.patrimonio_total,
            temp_anodec_fin: data.informacion.temporada_declaracion,
            temp_cuorealano_fin: data.informacion.cuota_real_anual,
            temp_cuorealafi_fin: data.informacion.cuota_real_afiliacion,
            userUpdated: data.usuario_actualizacion.editor,
            fechaUpdated: data.informacion.updated_at,
            temp_cuotaanual_fin: data.informacion.cuota_anual,
            temp_anocuota_fin: data.informacion.temporada_cuota,
            temp_import_fin: data.importaciones,
            temp_export_fin: data.exportaciones,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  handleClose = (a) => {
    if (a) {
      this.delInterAPi();
    } else {
      this.setState({
        temp_export_fin: [],
        temp_import_fin: [],
      });
    }
    setTimeout(this.callApi, 2000);
    this.setState({ openInter: false });
  };

  delInterAPi = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch("http://localhost:8000/api/auth/InformacionFinanciera/DelOpe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error("Error:", error);
    });
    this.addInterAPi();
  };

  addInterAPi = () => {
    const tempImp = {
      organizacion_id: this.state.dbid_org,
      paises: this.state.temp_import_fin,
    };
    const tempExp = {
      organizacion_id: this.state.dbid_org,
      paises: this.state.temp_export_fin,
    };
    fetch("http://localhost:8000/api/auth/Exportaciones/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(tempExp),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch("http://localhost:8000/api/auth/Importaciones/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(tempImp),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  callApiPut = (a) => {
    const idFin = this.state.temp_id_fin;
    const data = {
      organizacion_id: this.props.dbid_org,
      ingresos_anuales: this.state.temp_totaling_fin,
      egresos_anuales: this.state.temp_totalegr_fin,
      ingresos_operacionales: this.state.temp_ingope_fin,
      egresos_operacionales: this.state.temp_egrope_fin,
      ingresos_no_operacionales: this.state.temp_ingnoo_fin,
      egresos_no_operacionales: this.state.temp_egrnoo_fin,
      ventas_anuales: this.state.temp_ventas_fin,
      total_activos: this.state.temp_totalact_fin,
      total_pasivos: this.state.temp_totalpas_fin,
      patrimonio_total: this.state.temp_totalpat_fin,
      regimen_id: this.state.temp_regimen_fin,
      temporada_declaracion: this.state.temp_anodec_fin,
      clasificacion_id: this.state.temp_clas_fin,
      cuota_real_anual: this.state.temp_cuorealano_fin,
      cuota_real_afiliacion: this.state.temp_cuorealafi_fin,
      temporada_cuota: this.state.temp_anocuota_fin,
      cuota_anual: this.state.temp_cuotaanual_fin,
    };

    fetch("http://localhost:8000/api/auth/InformacionFinanciera/" + idFin, {
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
        if (data.succes) {
        }
      })
      .catch((error) => {
        this.setState({ reqText: true, createS: true });
      });
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
    setTimeout(this.callApi, 10000);
  };

  callApiPost = (a) => {
    const data = {
      organizacion_id: this.props.dbid_org,
      ingresos_anuales: this.state.temp_totaling_fin,
      egresos_anuales: this.state.temp_totalegr_fin,
      ingresos_operacionales: this.state.temp_ingope_fin,
      egresos_operacionales: this.state.temp_egrope_fin,
      ingresos_no_operacionales: this.state.temp_ingnoo_fin,
      egresos_no_operacionales: this.state.temp_egrnoo_fin,
      ventas_anuales: this.state.temp_ventas_fin,
      total_activos: this.state.temp_totalact_fin,
      total_pasivos: this.state.temp_totalpas_fin,
      patrimonio_total: this.state.temp_totalpat_fin,
      regimen_id: this.state.temp_regimen_fin,
      temporada_declaracion: this.state.temp_anodec_fin,
      clasificacion_id: this.state.temp_clas_fin,
      cuota_real_anual: this.state.temp_cuorealano_fin,
      cuota_real_afiliacion: this.state.temp_cuorealafi_fin,
    };

    fetch("http://localhost:8000/api/auth/InformacionFinanciera/", {
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
            temp_id_fin: data.informacion.id,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
    setTimeout(this.callApi, 10000);
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_ingope_fin":
        this.setState({ temp_ingope_fin: value });
        break;
      case "input_ingnoo_fin":
        this.setState({ temp_ingnoo_fin: value });
        break;
      case "input_totaling_fin":
        this.setState({ temp_totaling_fin: value });
        break;
      case "input_egrope_fin":
        this.setState({ temp_egrope_fin: value });
        break;
      case "input_egrnoo_fin":
        this.setState({ temp_egrnoo_fin: value });
        break;
      case "input_totalegr_fin":
        this.setState({ temp_totalegr_fin: value });
        break;
      case "input_totalact_fin":
        this.setState({ temp_totalact_fin: value });
        break;
      case "input_totalpas_fin":
        this.setState({ temp_totalpas_fin: value });
        break;
      case "input_clas_fin":
        this.setState({ temp_clas_fin: value }, () => {
          if (
            this.state.temp_clas_fin !== "" &&
            this.state.temp_clas_fin !== undefined
          ) {
            this.setState({
              temp_anocuota_fin: this.state.clas_fin_api[
                this.state.clas_fin_api.findIndex(
                  (x) => x.id === this.state.temp_clas_fin
                )
              ].temporada_cuota,
              temp_cuotaanual_fin: this.state.clas_fin_api[
                this.state.clas_fin_api.findIndex(
                  (x) => x.id === this.state.temp_clas_fin
                )
              ].cuota_anual,
            });
          }
        });
        break;
      case "input_regimen_fin":
        this.setState({ temp_regimen_fin: value });
        break;
      case "input_ventas_fin":
        this.setState({ temp_ventas_fin: value });
        break;
      case "input_totalpat_fin":
        this.setState({ temp_totalpat_fin: value });
        break;
      case "input_anodec_fin":
        this.setState({ temp_anodec_fin: value });
        break;
      case "input_cuorealano_fin":
        this.setState({ temp_cuorealano_fin: value });
        break;
      case "input_cuorealafi_fin":
        this.setState({ temp_cuorealafi_fin: value });
        break;
      case "input_import_fin":
        this.setState({ temp_import_fin: value });
        break;
      case "input_export_fin":
        this.setState({ temp_export_fin: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = window.innerHeight > 900 ? "0.4rem" : "0rem";
    const SUBTITLE_SPACING = window.innerHeight > 900 ? "2.1rem" : "1.7rem";
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Información financiera</h3>
          <h4 className="o-contentTittle-sub">
            campos marcados con * son obligatorios
          </h4>
          <div className="o-text-nameOrg">
            {" "}
            {"Organización: "}
            {this.props.name_org || ""}
          </div>
        </div>
        <div className="o-contentForm-big">
          <div className="o-contentForm">
            <h3 className="o-innerSubTittle">Ingresos</h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Ingresos operacionales"
                variant="outlined"
                value={this.state.temp_ingope_fin || ""}
                name="input_ingope_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Ingreso no operacionales"
                variant="outlined"
                value={this.state.temp_ingnoo_fin || ""}
                name="input_ingnoo_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Total ingresos"
                variant="outlined"
                value={this.state.temp_totaling_fin || ""}
                name="input_totaling_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <h3
              className="o-innerSubTittle2"
              style={{ marginTop: SUBTITLE_SPACING }}
            >
              Egresos
            </h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Egresos operacionales"
                variant="outlined"
                value={this.state.temp_egrope_fin || ""}
                name="input_egrope_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Egresos no operacionales"
                variant="outlined"
                value={this.state.temp_egrnoo_fin || ""}
                name="input_egrnoo_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Total egresos"
                variant="outlined"
                value={this.state.temp_totalegr_fin || ""}
                name="input_totalegr_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
          </div>

          <div className="o-contentForm">
            <h3 className="o-innerSubTittle">Otra información financiera</h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Total activos"
                variant="outlined"
                value={this.state.temp_totalact_fin || ""}
                name="input_totalact_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Total pasivos"
                variant="outlined"
                value={this.state.temp_totalpas_fin || ""}
                name="input_totalpas_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <FormControl
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Régimen tributario
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.temp_regimen_fin || ""}
                onChange={this.handleChange}
                label="Régimen tributario"
                name="input_regimen_fin"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
              >
                <MenuItem disabled={true} value=""></MenuItem>
                {this.state.regimen_fin_api.map((obj, i) => {
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
                label="Total patrimonio"
                variant="outlined"
                value={this.state.temp_totalpat_fin || ""}
                name="input_totalpat_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Año de declaración"
                variant="outlined"
                value={this.state.temp_anodec_fin || ""}
                name="input_anodec_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Ventas anuales"
                variant="outlined"
                value={this.state.temp_ventas_fin || ""}
                name="input_ventas_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div className="o-textBtn">
              <div className="o-inner-textBtn">Operaciones internaciones</div>
              <div className="o-inner-testBtnbtn">
                <BlueButton
                  style={{ justifyContent: "center" }}
                  onClick={() => {
                    this.setState({ openInter: true });
                  }}
                >
                  Editar
                  <IconEdit style={{ marginLeft: "0.7rem" }} size="small" />
                </BlueButton>
              </div>
            </div>
          </div>

          <div className="o-contentForm">
            <h3 className="o-innerSubTittle" style={{ color: "#FFFFFF" }}>
              ¡Me encontraste!
            </h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Cuota real anual"
                variant="outlined"
                value={this.state.temp_cuorealano_fin || ""}
                name="input_cuorealano_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Cuota real afiliación"
                variant="outlined"
                value={this.state.temp_cuorealafi_fin || ""}
                name="input_cuorealafi_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <FormControl
              style={{ maxWidth: "100%" }}
              variant="outlined"
              margin="dense"
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Clasificación
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.temp_clas_fin || ""}
                onChange={this.handleChange}
                label="Clasificación"
                name="input_clas_fin"
                className="o-space"
              >
                <MenuItem disabled={true} value=""></MenuItem>
                {this.state.clas_fin_api.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "1rem 0 0.2rem",
              }}
            >
              {"Año cuota:"}
              {this.state.temp_anocuota_fin === "" ? (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>{"0"}</div>
              ) : (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>
                  {this.state.temp_anocuota_fin}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "0.2rem 0",
              }}
            >
              {"Cuota anual:"}
              {this.state.temp_cuotaanual_fin === "" ? (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>{"0"}</div>
              ) : (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>
                  {this.state.temp_cuotaanual_fin}
                </div>
              )}
            </div>
            <div className="o-textMain" style={{ fontSize: "1rem" }}>
              {"Última actualización:"}
              <div className="o-textSub">
                {this.state.userUpdated || ""}
                {" - "}
                {this.state.fechaUpdated || ""}
              </div>
            </div>
          </div>
        </div>
        <div className="o-btnBotNav">
          <div style={{ color: "#FFFFFF" }}>{"Me encontraste!"}</div>
          <div className="o-btnBotNavDoble">
            <div className="o-btnBotNav-btn">
              <GreenButton
                onClick={() => {
                  if (this.state.temp_id_fin === "") {
                    this.callApiPost();
                  } else {
                    this.callApiPut();
                  }
                }}
              >
                Guardar
              </GreenButton>
            </div>
            <Link
              exact={"true"}
              to="/consultar_organizacion/editar"
              className="o-btnBotNav-btn"
            >
              <BlueButton>Volver</BlueButton>
            </Link>
          </div>
        </div>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.openInter}
          maxWidth={false}
        >
          <DialogTitle>
            <div className="o-row">Operaciones internacionales</div>
          </DialogTitle>
          <div className="o-diagContent"></div>
          <DialogContent>
            <div className="o-contentForm-big">
              <div className="o-contentFormDiag">
                <FormControl
                  style={{ maxWidth: "100%" }}
                  variant="outlined"
                  margin="dense"
                  className="o-space"
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Importaciones
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="grouped-select"
                    multiple
                    value={this.state.temp_import_fin || []}
                    onChange={this.handleChange}
                    name="input_import_fin"
                    label="Importaciones"
                    className="o-space"
                    MenuProps={{
                      getContentAnchorEl: () => null,
                    }}
                    renderValue={(selected) => (
                      <div className="o-chips">
                        {selected.map((obj, i) => (
                          <Chip
                            key={i}
                            label={
                              this.state.pais_fin_api[
                                this.state.pais_fin_api.findIndex(
                                  (x) => x.id === obj
                                )
                              ].nombre
                            }
                            className="o-chip"
                          />
                        ))}
                      </div>
                    )}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_import_fin"
                    ></MenuItem>
                    {this.state.pais_fin_api.map((obj, i) => (
                      <MenuItem key={i} value={obj.id}>
                        <Checkbox
                          checked={
                            this.state.temp_import_fin.indexOf(obj.id) > -1
                          }
                        />
                        <ListItemText primary={obj.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="o-contentFormDiag">
                <FormControl
                  style={{ maxWidth: "100%" }}
                  variant="outlined"
                  margin="dense"
                  className="o-space"
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Exportaciones
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="grouped-select"
                    multiple
                    value={this.state.temp_export_fin || []}
                    onChange={this.handleChange}
                    name="input_export_fin"
                    label="Exportaciones"
                    className="o-space"
                    MenuProps={{
                      getContentAnchorEl: () => null,
                    }}
                    renderValue={(selected) => (
                      <div className="o-chips">
                        {selected.map((obj, i) => (
                          <Chip
                            key={i}
                            label={
                              this.state.pais_fin_api[
                                this.state.pais_fin_api.findIndex(
                                  (x) => x.id === obj
                                )
                              ].nombre
                            }
                            className="o-chip"
                          />
                        ))}
                      </div>
                    )}
                  >
                    <MenuItem
                      disabled={true}
                      value="input_export_fin"
                    ></MenuItem>
                    {this.state.pais_fin_api.map((obj, i) => (
                      <MenuItem key={i} value={obj.id}>
                        <Checkbox
                          checked={
                            this.state.temp_export_fin.indexOf(obj.id) > -1
                          }
                        />
                        <ListItemText primary={obj.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
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
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.createS} maxWidth={false}>
          <DialogTitle style={{ textAlign: "center" }}>
            {"Datos inválidos"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            (Solo se permiten números)
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

export default Consultar4Finanzas;
