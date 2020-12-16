import React, { Component } from "react";
import Login from "./Log";
import "./Main.css";
import logo from "../../Assets/logo2.png";
import { TextField, Button } from "@material-ui/core/";
import { Switch, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, updatePass } from "../../Actions";

let dispatch;

class Main extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      user: "",
      pass: "",
      roll: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let storeToken = useSelector((state) => state.token);
    this.setState({ token: storeToken });
    dispatch = useDispatch();
  }

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "input_user":
        this.setState({ user: value });
        dispatch(updateUser(value));
        break;
      case "input_pass":
        this.setState({ pass: value });
        dispatch(updatePass(value));
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="o-main">
        <Switch>
          <Route exact path="/">
            <div className="o-login">
              <div className="o-loginCard">
                <img className="o-logoLogin" src={logo} />
                <div className="o-space-log">
                  <TextField
                    label="Usuario"
                    variant="outlined"
                    value={this.state.user || ""}
                    name="input_user"
                    onChange={this.handleChange}
                    className="o-space-log-input"
                  />
                </div>
                <div className="o-space-log">
                  <TextField
                    label="Contraseña"
                    variant="outlined"
                    value={this.state.pass || ""}
                    name="input_pass"
                    type="password"
                    onChange={this.handleChange}
                    className="o-space-log-input"
                  />
                </div>
                <Link className="o-passLost" to="password_recovery">
                  ¿Olvidaste tu contraseña?
                </Link>
                <Link
                  className="o-btnLogin"
                  to="/dashboard"
                  component={Button}
                  variant="contained"
                  color="primary"
                  name="btn_login"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </Route>
          <Route path="/dashboard">
            <Login />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default Main;
