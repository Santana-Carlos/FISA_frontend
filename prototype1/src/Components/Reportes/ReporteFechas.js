import React, { Component } from "react";
import { saveAs } from "file-saver";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
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
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
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
  RedButton,
  StyledTableCell,
} from "../Buttons";
import {
  Refresh as IconRefresh,
  GetApp as IconDownload,
} from "@material-ui/icons";
import "../Styles.css";

class ReporteFechas extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.token,
      loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {}

  render() {
    const BOX_SPACING = window.innerHeight > 900 ? "0.4rem" : "0rem";
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
        <div className="o-contentForm-big-consultas">
          <div className="o-contentForm">
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Buscar*"
                variant="outlined"
                name="input_palabra1"
                value={this.state.palabra1 || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
                error={this.state.reqText && this.state.palabra1 === ""}
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Buscar*"
                variant="outlined"
                name="input_palabra1"
                value={this.state.palabra1 || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
                error={this.state.reqText && this.state.palabra1 === ""}
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  variant="inline"
                  format="dd/MM/yy"
                  margin="dense"
                  label="Fecha afiliacion"
                  value={this.state.fechaafi_org || null}
                  onChange={this.handleDateAfi}
                  className="o-space"
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReporteFechas;
