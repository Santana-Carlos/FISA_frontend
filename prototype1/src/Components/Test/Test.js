import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import "./Test.css";

class Test extends Component {
  constructor() {
    super();
    this.state = {
      ciiu_open: false,
      testvar: [],
      testvar_list: [
        { value: "0010", name: "0010 Asalariados" },
        {
          value: "0081",
          name: "0081 Sin actividad económica, solo para personas naturales",
        },
        {
          value: "0082",
          name: "0082 Personas Naturales Subsidiadas por Terceros",
        },
        {
          value: "0090",
          name: "0090 Rentistas de Capital, solo para personas naturales",
        },
        {
          value: "0111",
          name:
            "0111 Cultivo de cereales (excepto arroz), legumbres y semillas oleaginosas",
        },
        {
          value: "0112",
          name: "0112 Cultivo de arroz",
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClickOpen() {
    this.setState({ ciiu_open: true });
  }

  handleClose() {
    this.setState({ ciiu_open: false });
  }

  handleChange(event) {
    let value = event.target.value;
    this.setState({ testvar: value });
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Open select dialog</Button>
        {this.state.testvar}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.ciiu_open}
          onClose={this.handleClose}
        >
          <div className="o-diag-content"></div>
          <DialogTitle>Fill the form</DialogTitle>
          <DialogContent>
            <form>
              <FormControl
                variant="outlined"
                margin="dense"
                className="o-space"
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  CIIU
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  multiple
                  value={this.state.testvar}
                  onChange={this.handleChange}
                  label="Estado"
                  name="input_ciuu_org"
                  renderValue={(selected) => (
                    <div className="o-chips">
                      {selected.map((obj, i) => (
                        <Chip key={i} label={obj} className="o-chip" />
                      ))}
                    </div>
                  )}
                >
                  {this.state.testvar_list.map((obj, i) => (
                    <MenuItem key={i} value={obj.value}>
                      <Checkbox
                        checked={this.state.testvar.indexOf(obj.value) > -1}
                      />
                      <ListItemText primary={obj.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Test;
