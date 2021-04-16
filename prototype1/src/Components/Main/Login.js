import React from "react";
import "./Main.css";
import logo from "../../Assets/FisaLogo.png";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core/";
import { BlueButton, GreenButton } from "../Buttons";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUser,
  updatePass,
  updateRol,
  loginToken,
  logIn,
  logOut,
} from "../../Actions";

const Login = () => {
  const [loading, setloading] = React.useState(false);
  const [diag, setDiag] = React.useState(false);
  const [diagserver, setDiagserver] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const pass = useSelector((state) => state.pass);

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_user":
        dispatch(updateUser(value));
        break;
      case "input_pass":
        dispatch(updatePass(value));
        break;
      default:
        break;
    }
  };

  const callApiLogin = () => {
    setloading(true);
    const data = {
      usuario: user,
      password: pass,
    };
    fetch(process.env.REACT_APP_API_URL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          dispatch(loginToken(data.token));
          dispatch(updateRol(data.rol));
          dispatch(logIn());
          setloading(false);
          window.location.assign("/dashboard");
        } else {
          setloading(false);
          dispatch(logOut());
          setDiag(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
        setDiagserver(true);
      });
  };

  return (
    <div className="o-login">
      <div className="o-loginCard">
        <img className="o-logoLogin" src={logo} alt="Logo FISA" />
        <div className="o-space-log">
          <TextField
            size="small"
            label="Usuario"
            variant="outlined"
            value={user || ""}
            name="input_user"
            onChange={handleChange}
            className="o-space-log-input"
          />
        </div>
        <div className="o-space-log">
          <TextField
            size="small"
            label="Contraseña"
            variant="outlined"
            value={pass || ""}
            name="input_pass"
            type="password"
            onChange={handleChange}
            className="o-space-log-input"
          />
        </div>
        <Link className="o-passLost" to="password_recovery">
          {"¿Olvidaste tu contraseña?"}
        </Link>
        <div className="o-btnLogin">
          <BlueButton
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            primary="true"
            className="o-btnLogin-btn"
            onClick={callApiLogin}
          >
            {"Iniciar sesión"}
          </BlueButton>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          margin: "auto 0.5rem 0.5rem auto",
          fontSize: "0.8rem",
          color: "#ffffff",
        }}
      >
        {"FISA © 2021 v" + process.env.REACT_APP_VERSION}
      </div>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={diag}
        maxWidth={false}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          {"Credenciales inválidas"}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <div className="o-btnBotNav-btnDiag3">
            <GreenButton onClick={() => setDiag(false)}>
              {"Aceptar"}
            </GreenButton>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={diagserver}
        maxWidth={false}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          {"Servidor no disponible"}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {"(El servidor presenta problemas o no se encuentra disponible)"}
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <div className="o-btnBotNav-btnDiag3">
            <GreenButton onClick={() => setDiagserver(false)}>
              {"Aceptar"}
            </GreenButton>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={loading}
        maxWidth={false}
      >
        <DialogContent
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div style={{ fontSize: "1.2rem", margin: "1rem" }}>
            {"Iniciando sesión... "}
            <CircularProgress size={"1.5rem"} thickness={6} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
