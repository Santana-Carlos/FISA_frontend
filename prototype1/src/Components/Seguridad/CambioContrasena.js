import React, { Component } from "react";
import {
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  FormControl,
  TextField,
  Fade,
  CircularProgress,
} from "@material-ui/core";
import { GreenButton, StyledIconButton as IconButton } from "../Buttons";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import "../Styles.css";

class CambioContrasena extends Component {
  constructor(props) {
    super();
    this.state = {
      temp_nid_seg: "",
      temp_email_seg: "",
      temp_pass_seg: "",
      temp_passcon_seg: "",
      temp_color: "#bdbdbd",
      a: false,
      b: false,
      showpass: false,
      showpasscon: false,
      loading: false,
      box_spacing: window.innerHeight > 900 ? "0.8rem" : "0.2rem",
      winInterval: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resizeBox = () => {
    this.setState({
      box_spacing: window.innerHeight > 900 ? "0.8rem" : "0.2rem",
    });
  };

  componentDidMount() {
    this.setState({
      winInterval: window.setInterval(this.resizeBox, 1000),
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.winInterval);
  }

  callApi = () => {
    if (
      this.state.temp_pass_seg !== "" &&
      this.state.temp_pass_seg === this.state.temp_passcon_seg
    ) {
      this.setState({
        loading: true,
        a: false,
        b: false,
        temp_color: "#bdbdbd",
      });
      const data = {
        numero_documento: this.state.temp_nid_seg,
        email: this.state.temp_email_seg,
        password: this.state.temp_pass_seg,
      };
      fetch(process.env.REACT_APP_API_URL + "User/Pass", {
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
              temp_color: "#47b14c",
              loading: false,
              a: true,
            });
            this.clearTemp();
          } else {
            this.setState({
              temp_color: "#dc004e",
              loading: false,
              b: true,
            });
          }
        })
        .catch((error) => {
          //console.log(error);
          this.setState({
            temp_color: "#dc004e",
            loading: false,
            b: true,
          });
        });
    }
  };

  clearTemp = () => {
    this.setState({
      temp_nid_seg: "",
      temp_email_seg: "",
      temp_pass_seg: "",
      temp_passcon_seg: "",
    });
  };

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_nid_seg":
        this.setState({ temp_nid_seg: value });
        break;
      case "input_email_seg":
        this.setState({ temp_email_seg: value });
        break;
      case "input_pass_seg":
        this.setState({ temp_pass_seg: value });
        break;
      case "input_passcon_seg":
        this.setState({ temp_passcon_seg: value });
        break;
      default:
        break;
    }
  }

  render() {
    const BOX_SPACING = this.state.box_spacing;
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Cambio de contraseña</h3>
          <h4 className="o-contentTittle-sub">
            Ingresar una nueva contraseña eliminará la anterior, este proceso es
            irreversible
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
        <div className="o-contentForm-big-consultas">
          <div
            className="o-contentForm-parametros30per"
            style={{ height: "80%", justifyContent: "center" }}
          >
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Cédula"
                variant="outlined"
                value={this.state.temp_nid_seg || ""}
                name="input_nid_seg"
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <div style={{ marginBottom: BOX_SPACING }}>
              <TextField
                label="Correo"
                variant="outlined"
                name="input_email_seg"
                value={this.state.temp_email_seg || ""}
                onChange={this.handleChange}
                className="o-space"
                margin="dense"
              />
            </div>
            <FormControl variant="outlined" margin="dense">
              <InputLabel>Contraseña</InputLabel>
              <OutlinedInput
                type={this.state.showpass ? "text" : "password"}
                value={this.state.temp_pass_seg || ""}
                name="input_pass_seg"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
                onChange={this.handleChange}
                label={"Contraseña"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      disabled={this.state.temp_accion === ""}
                      size="small"
                      onClick={() =>
                        this.setState({ showpass: !this.state.showpass })
                      }
                    >
                      {this.state.showpass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl
              variant="outlined"
              margin="dense"
              error={this.state.temp_pass_seg !== this.state.temp_passcon_seg}
            >
              <InputLabel>Confirmar contraseña</InputLabel>
              <OutlinedInput
                type={this.state.showpasscon ? "text" : "password"}
                value={this.state.temp_passcon_seg || ""}
                name="input_passcon_seg"
                className="o-space"
                style={{ marginBottom: BOX_SPACING }}
                onChange={this.handleChange}
                label={"Confirmar contraseña"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      disabled={this.state.temp_accion === ""}
                      size="small"
                      onClick={() =>
                        this.setState({
                          showpasscon: !this.state.showpasscon,
                        })
                      }
                    >
                      {this.state.showpasscon ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {this.state.temp_pass_seg !== this.state.temp_passcon_seg ? (
                <FormHelperText>Las contraseñas no coinciden</FormHelperText>
              ) : null}
            </FormControl>
            <div className="o-btnAnadirTable">
              <GreenButton onClick={this.callApi}>Guardar</GreenButton>
            </div>
          </div>
          <div
            className="o-contentForm-parametros30per"
            style={{
              height: "75%",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10rem",
              marginLeft: 0,
              color: this.state.temp_color,
            }}
          >
            <Lock color="inherit" fontSize="inherit" />
            {this.state.a ? (
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#47b14c",
                }}
              >
                Contraseña modificada exitosamente
              </div>
            ) : null}
            {this.state.b ? (
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#dc004e",
                }}
              >
                Datos inválidos
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default CambioContrasena;
