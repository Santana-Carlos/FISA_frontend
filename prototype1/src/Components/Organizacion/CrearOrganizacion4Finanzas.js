import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField as TextFieldNormal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TextField from "@unicef/material-ui-currency-textfield";
import { Edit as IconEdit } from "@material-ui/icons";
import {
  BlueButton,
  GreenButton,
  RedButton,
  CustomChip as Chip,
} from "../Buttons";
import { Link, Redirect } from "react-router-dom";
import "../Styles.css";

class CrearOrganizacion4Finanzas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      dbid_org: props.dbid_org,
      name_org: props.name_org,
      reqText: false,
      createS: false,
      openInter: false,
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
      temp_cuopau_fin: "",
      temp_fecpau_fin: "",
      temp_pendfac_fin: "",
      temp_import_fin: [],
      temp_export_fin: [],
      temp_importcheck_fin: false,
      temp_exportcheck_fin: false,
      temp_anocuota_fin: "",
      temp_cuotaanual_fin: "",
      clas_fin_api: [],
      regimen_fin_api: [],
      pais_fin_api: [],
      loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/Data", {
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
      .catch((error) => {});
    this.callApi();
    this.callApiOI();
  }

  callApi = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/Org", {
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
            temp_cuorealano_fin: data.informacion.cuota_unica_ingreso,
            temp_cuorealafi_fin: data.informacion.cuota_real_pagada,
            temp_cuopau_fin: data.informacion.cuota_pautas,
            temp_fecpau_fin: data.informacion.fecha_edicion_pauta,
            temp_pendfac_fin: data.informacion.pendiente_facturacion,
            userUpdated: data.usuario_actualizacion.editor,
            fechaUpdated: data.informacion.updated_at,
            temp_cuotaanual_fin: data.informacion.cuota_anual,
            temp_anocuota_fin: data.informacion.temporada_cuota,
            temp_importcheck_fin: data.informacion.importa,
            temp_exportcheck_fin: data.informacion.exporta,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  callApiOI = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/Org", {
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
            temp_import_fin: data.importaciones,
            temp_export_fin: data.exportaciones,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleClose = (a) => {
    if (a) {
      this.setState({ loading: true });
      this.delInterAPi();
    } else {
      this.setState({
        temp_export_fin: [],
        temp_import_fin: [],
      });
      this.callApiOI();
    }
    setTimeout(this.callApiOI, 2000);
    this.setState({ openInter: false });
  };

  delInterAPi = () => {
    const data = {
      organizacion_id: this.props.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/DelOpe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(data),
    }).catch((error) => {});
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
    fetch(process.env.REACT_APP_API_URL + "Exportaciones/", {
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
      .catch((error) => {});

    fetch(process.env.REACT_APP_API_URL + "Importaciones/", {
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
      .catch((error) => {});
    setTimeout(this.callApiOI, 2000);
    setTimeout(this.callApiOI, 5000);
  };

  callApiPost = (a) => {
    this.setState({ loading: true });
    if (this.state.temp_id_fin === "") {
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
        cuota_unica_ingreso: this.state.temp_cuorealano_fin,
        cuota_real_pagada: this.state.temp_cuorealafi_fin,
        cuota_pautas: this.state.temp_cuopau_fin,
        temporada_cuota: this.state.temp_anocuota_fin,
        cuota_anual: this.state.temp_cuotaanual_fin,
        fecha_edicion_pauta: this.state.temp_fecpau_fin,
        pendiente_facturacion: this.state.temp_pendfac_fin,
        importa: this.state.temp_importcheck_fin,
        exporta: this.state.temp_exportcheck_fin,
      };

      fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/", {
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
            this.setState({ temp_id_fin: data.informacion.id, reqText: false });
            if (a) {
              window.location.assign(
                "/dashboard/organizacion#/crear_organizacion/"
              );
            } else {
              window.location.assign(
                "/dashboard/organizacion#/crear_organizacion/archivos"
              );
            }
          }
        })
        .catch((error) => {
          this.setState({ reqText: true, createS: true });
        });

      setTimeout(this.callApi, 2000);
      setTimeout(this.callApi, 5000);
    } else {
      this.callApiPut(a);
    }
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
      cuota_unica_ingreso: this.state.temp_cuorealano_fin,
      cuota_real_pagada: this.state.temp_cuorealafi_fin,
      cuota_pautas: this.state.temp_cuopau_fin,
      temporada_cuota: this.state.temp_anocuota_fin,
      cuota_anual: this.state.temp_cuotaanual_fin,
      fecha_edicion_pauta: this.state.temp_fecpau_fin,
      pendiente_facturacion: this.state.temp_pendfac_fin,
      importa: this.state.temp_importcheck_fin,
      exporta: this.state.temp_exportcheck_fin,
    };

    fetch(process.env.REACT_APP_API_URL + "InformacionFinanciera/" + idFin, {
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
          if (a) {
            window.location.assign(
              "/dashboard/organizacion#/crear_organizacion/"
            );
          } else {
            window.location.assign(
              "/dashboard/organizacion#/crear_organizacion/archivos"
            );
          }
        }
      })
      .catch((error) => {
        this.setState({ reqText: true, createS: true });
      });
    setTimeout(this.callApi, 2000);
    setTimeout(this.callApi, 5000);
  };

  handleChange(event, value2) {
    let value = event.target.value;
    let name = event.target.name;
    let checked = event.target.checked;

    switch (name) {
      case "input_ingope_fin":
        this.setState({ temp_ingope_fin: value2 });
        break;
      case "input_ingnoo_fin":
        this.setState({ temp_ingnoo_fin: value2 });
        break;
      case "input_totaling_fin":
        this.setState({ temp_totaling_fin: value2 });
        break;
      case "input_egrope_fin":
        this.setState({ temp_egrope_fin: value2 });
        break;
      case "input_egrnoo_fin":
        this.setState({ temp_egrnoo_fin: value2 });
        break;
      case "input_totalegr_fin":
        this.setState({ temp_totalegr_fin: value2 });
        break;
      case "input_totalact_fin":
        this.setState({ temp_totalact_fin: value2 });
        break;
      case "input_totalpas_fin":
        this.setState({ temp_totalpas_fin: value2 });
        break;
      case "input_clas_fin":
        this.setState({ temp_clas_fin: value }, () => {
          if (
            this.state.temp_clas_fin !== "" &&
            this.state.temp_clas_fin !== undefined &&
            this.state.temp_clas_fin !== null
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
        this.setState({ temp_ventas_fin: value2 });
        break;
      case "input_totalpat_fin":
        this.setState({ temp_totalpat_fin: value2 });
        break;
      case "input_anodec_fin":
        this.setState({ temp_anodec_fin: value });
        break;
      case "input_cuorealano_fin":
        this.setState({ temp_cuorealano_fin: value2 });
        break;
      case "input_cuorealafi_fin":
        this.setState({ temp_cuorealafi_fin: value2 });
        break;
      case "input_cuopau_fin":
        this.setState({ temp_cuopau_fin: value2 });
        break;
      case "input_import_fin":
        this.setState({ temp_import_fin: value });
        break;
      case "input_export_fin":
        this.setState({ temp_export_fin: value });
        break;
      case "input_importcheck_fin":
        this.setState({ temp_importcheck_fin: checked });
        break;
      case "input_exportcheck_fin":
        this.setState({ temp_exportcheck_fin: checked });
        break;
      case "input_pendfac_fin":
        this.setState({ temp_pendfac_fin: value2 });
        break;
      default:
        break;
    }
  }

  handleDatePau = (date) => {
    if (date !== null && date !== "") {
      date.setHours(12);
      this.setState({ temp_fecpau_fin: date });
    } else {
      this.setState({ temp_fecpau_fin: "" });
    }
  };

  render() {
    const BOX_SPACING = this.props.box_spacing;
    const SUBTITLE_SPACING = this.props.subtitle_spacing;
    return (
      <div className="o-cardContent">
        {this.props.dbid_org === "" ? (
          <Redirect exact to="/crear_organizacion" />
        ) : null}
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Información financiera</h3>
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
            <h3 className="o-innerSubTittle">Ingresos</h3>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Ingresos operacionales"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
                value={this.state.temp_ingope_fin || ""}
                name="input_ingope_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Ingresos no operacionales"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
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
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
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
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
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
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
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
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
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
            <div className="o-row">
              <div
                style={{
                  maxWidth: "46%",
                  marginLeft: 0,
                  marginBottom: BOX_SPACING,
                }}
              >
                <TextField
                  label="Ttl. activos"
                  variant="outlined"
                  decimalPlaces={0}
                  maximumValue={"999999999999999999999999"}
                  minimumValue={"-999999999999999999999999"}
                  value={this.state.temp_totalact_fin || ""}
                  name="input_totalact_fin"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div
                style={{
                  marginLeft: "1rem",
                  marginBottom: BOX_SPACING,
                }}
              >
                <TextField
                  label="Ttl. pasivos"
                  variant="outlined"
                  decimalPlaces={0}
                  maximumValue={"999999999999999999999999"}
                  minimumValue={"-999999999999999999999999"}
                  value={this.state.temp_totalpas_fin || ""}
                  name="input_totalpas_fin"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Total patrimonio"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
                value={this.state.temp_totalpat_fin || ""}
                name="input_totalpat_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div className="o-row">
              <div
                style={{
                  maxWidth: "46%",
                  marginLeft: 0,
                  marginBottom: BOX_SPACING,
                }}
              >
                <TextField
                  label="Ventas anls."
                  variant="outlined"
                  decimalPlaces={0}
                  maximumValue={"999999999999999999999999"}
                  minimumValue={"-999999999999999999999999"}
                  value={this.state.temp_ventas_fin || ""}
                  name="input_ventas_fin"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
              <div
                style={{
                  marginLeft: "1rem",
                  marginBottom: BOX_SPACING,
                }}
              >
                <TextFieldNormal
                  label="Año decl."
                  variant="outlined"
                  value={this.state.temp_anodec_fin || ""}
                  name="input_anodec_fin"
                  onChange={this.handleChange}
                  className="o-space"
                  margin="dense"
                />
              </div>
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
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Pendiente facturación"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
                value={this.state.temp_pendfac_fin || ""}
                name="input_pendfac_fin"
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
                label="Cuota única ingreso"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
                value={this.state.temp_cuorealano_fin || ""}
                name="input_cuorealano_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Cuota real pagada"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
                value={this.state.temp_cuorealafi_fin || ""}
                name="input_cuorealafi_fin"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Cuota pautas"
                variant="outlined"
                decimalPlaces={0}
                maximumValue={"999999999999999999999999"}
                minimumValue={"-999999999999999999999999"}
                value={this.state.temp_cuopau_fin || ""}
                name="input_cuopau_fin"
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
                  label="Fecha edición pauta"
                  value={this.state.temp_fecpau_fin || null}
                  onChange={this.handleDatePau}
                  className="o-space"
                  invalidDateMessage={"Fecha inválida"}
                  autoOk={true}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "1rem 0 0.2rem",
              }}
            >
              {"Año cuota:"}
              {this.state.temp_anocuota_fin === "" ||
              this.state.temp_anocuota_fin === null ? (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>{"-"}</div>
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
              {this.state.temp_cuotaanual_fin === "" ||
              this.state.temp_cuotaanual_fin === null ? (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>{"-"}</div>
              ) : (
                <div style={{ color: "gray", marginLeft: "0.3rem" }}>
                  {this.state.temp_cuotaanual_fin}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="o-btnBotNav">
          <Link to="/crear_organizacion/contactos" className="o-btnBotNav-btn">
            <BlueButton>Anterior</BlueButton>
          </Link>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 0,
            }}
          >
            <FormControlLabel
              style={{ margin: 0 }}
              control={
                <Checkbox
                  checked={this.state.temp_importcheck_fin || false}
                  color="primary"
                  name="input_importcheck_fin"
                  style={{
                    padding: "0 0.4rem",
                    marginLeft: "0.5rem",
                  }}
                  onChange={this.handleChange}
                />
              }
              label="Importa"
              margin="dense"
            />
            <FormControlLabel
              style={{ margin: 0 }}
              control={
                <Checkbox
                  checked={this.state.temp_exportcheck_fin || false}
                  color="primary"
                  name="input_exportcheck_fin"
                  style={{
                    padding: "0 0.4rem",
                    marginLeft: "1.5rem",
                  }}
                  onChange={this.handleChange}
                />
              }
              label="Exporta"
              margin="dense"
            />
          </div>
          <div className="o-btnBotNavDoble">
            <div
              exact="true"
              to="/crear_organizacion/"
              className="o-btnBotNav-btn"
            >
              <GreenButton onClick={() => this.callApiPost(true)}>
                Finalizar
              </GreenButton>
            </div>
            <div to="/crear_organizacion/archivos" className="o-btnBotNav-btn">
              <BlueButton onClick={() => this.callApiPost(false)}>
                Siguiente
              </BlueButton>
            </div>
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
                  disabled={!this.state.temp_importcheck_fin}
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
                  disabled={!this.state.temp_exportcheck_fin}
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
                {"Cancelar"}
              </RedButton>
            </div>
            <div className="o-btnBotNav-btnDiag2">
              <GreenButton onClick={() => this.handleClose(true)}>
                {"Guardar"}
              </GreenButton>
            </div>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.createS} maxWidth={false}>
          <DialogTitle style={{ textAlign: "center" }}>
            {"Datos inválidos"}
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

export default CrearOrganizacion4Finanzas;
