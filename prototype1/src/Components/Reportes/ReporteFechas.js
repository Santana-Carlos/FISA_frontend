import React, { Component } from "react";
import { saveAs } from "file-saver";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
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
  DatePicker,
} from "@material-ui/pickers";
import { GreenButton } from "../Buttons";
import { GetApp as IconDownload } from "@material-ui/icons";
import "../Styles.css";

const items = [
  {
    id: 1,
    nombre: "Organizaciones",
  },
  {
    id: 2,
    nombre: "Contactos",
  },
];

class ReporteFechas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      tipoRep: 1,
      dateStart: "",
      dateEnd: "",
      createS: false,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  apiReportOrg = () => {
    this.setState({ loading: true });
    const dateStart = this.state.dateStart;
    const dateEnd = this.state.dateEnd;
    const data = {
      fecha_inicio: dateStart,
      fecha_fin: dateEnd,
    };
    if (dateStart !== "" && dateEnd !== "") {
      fetch(process.env.REACT_APP_API_URL + "Organizacion/RepFec", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.blob();
        })
        .then((data) => {
          this.setState({ loading: false });
          saveAs(data, "ORGANIZACIONES_REPORTE_TEMPORADA");
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false, createS: true });
    }
  };

  apiReportCon = () => {
    this.setState({ loading: true });
    const dateStart = this.state.dateStart;
    const dateEnd = this.state.dateEnd;
    const data = {
      fecha_inicio: dateStart,
      fecha_fin: dateEnd,
    };
    if (dateStart !== "" && dateEnd !== "") {
      fetch(process.env.REACT_APP_API_URL + "Contacto/RepFec", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.blob();
        })
        .then((data) => {
          this.setState({ loading: false });
          saveAs(data, "CONTACTOS_REPORTE_TEMPORADA");
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false, createS: true });
    }
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_tipoRep":
        this.setState({ tipoRep: value });
        break;
      default:
        break;
    }
  }

  handleDateStart = (date) => {
    if (date !== null && date !== "") {
      date.setHours(12);
      this.setState({ dateStart: date });
    } else {
      this.setState({ dateStart: "" });
    }
  };

  handleDateEnd = (date) => {
    if (date !== null && date !== "") {
      date.setHours(12);
      this.setState({ dateEnd: date });
    } else {
      this.setState({ dateEnd: "" });
    }
  };

  render() {
    const BOX_SIZE =
      window.innerHeight > 900 ? "1rem 0 0 2rem" : "1rem 0 0 0.5rem";
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3
            className="o-contentTittle-principal"
            style={{ marginTop: "0.2rem" }}
          >
            {"Generar reporte por temporada"}
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
        <div
          className="o-contentForm-big-consultas"
          style={{ padding: BOX_SIZE }}
        >
          <div className="o-container-reporteFecha">
            <div
              className="o-datepicker"
              style={{ margin: "0.6rem 0 0.4rem", paddingBottom: "0.5rem" }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  autoOk
                  variant="static"
                  openTo="date"
                  disableToolbar={true}
                  value={this.state.dateStart || null}
                  onChange={this.handleDateStart}
                />
              </MuiPickersUtilsProvider>
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                variant="inline"
                format="dd/MM/yyyy"
                margin="dense"
                label="Desde"
                open={false}
                keyboardIcon={null}
                value={this.state.dateStart || null}
                onChange={this.handleDateStart}
                className="o-space"
                invalidDateMessage={"Fecha inválida"}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className="o-container-reporteFecha">
            <div
              className="o-datepicker"
              style={{ margin: "0.6rem 0 0.4rem", paddingBottom: "0.5rem" }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  autoOk
                  variant="static"
                  openTo="date"
                  disableToolbar={true}
                  value={this.state.dateEnd || null}
                  onChange={this.handleDateEnd}
                />
              </MuiPickersUtilsProvider>
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                variant="inline"
                format="dd/MM/yyyy"
                margin="dense"
                label="Hasta"
                open={false}
                keyboardIcon={null}
                value={this.state.dateEnd || null}
                onChange={this.handleDateEnd}
                className="o-space"
                invalidDateMessage={"Fecha inválida"}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className="o-container-reporteFechaLast">
            <FormControl variant="outlined" margin="dense">
              <InputLabel id="demo-simple-select-outlined-label">
                Tipo reporte
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.tipoRep || ""}
                onChange={this.handleChange}
                label="Tipo reporte"
                name="input_tipoRep"
                className="o-space"
                style={{ width: "10rem" }}
              >
                <MenuItem disabled={true} value="input_tipoRep"></MenuItem>
                {items.map((obj, i) => {
                  return (
                    <MenuItem key={i} value={obj.id}>
                      {obj.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <div
              className="o-consultas"
              style={{ width: "10rem", marginRight: 0 }}
            >
              <div
                className="o-btnConsultas"
                style={{
                  marginTop: "0.2rem",
                  width: "10rem",
                }}
              >
                <GreenButton
                  onClick={
                    this.state.tipoRep === 2
                      ? this.apiReportCon
                      : this.apiReportOrg
                  }
                >
                  Reporte
                  <IconDownload style={{ marginLeft: "0.4rem" }} size="small" />
                </GreenButton>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={this.state.createS} maxWidth={false}>
          <DialogTitle style={{ textAlign: "center" }}>
            {"Fechas inválidas"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            {"(Debe ingresar fecha de inicio y fecha final)"}
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

export default ReporteFechas;
