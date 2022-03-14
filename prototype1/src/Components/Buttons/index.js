import "date-fns";
import { Fragment, useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  IconButton,
  TableCell,
  Chip,
  Tooltip,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Dialog,
  Divider,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { InsertInvitation as CalendarIcon } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  dateRangeDialog: {
    width: 661,
    maxWidth: "unset",
    padding: 20,
    borderRadius: 10,
  },
  dateRangeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateRangePickersContainer: {
    display: "flex",
    flexDirection: "column",
    width: 310,
  },
  dateRangeDivider: {
    color: "#C4C4C4",
    position: "absolute",
    left: "50%",
    top: -20,
    height: "calc(100% + 20px)",
  },
}));

export const SideButton = withStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    textTransform: "none",
    color: "#FFFFFF",
    borderRadius: 0,
    fontSize: "1.06rem",
    fontWeight: "lighter",
    textAlign: "start",
    paddingLeft: "1.3rem",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)",
    },
  },
}))(Button);

export const BlueButton = withStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    textTransform: "none",
    color: "#FFFFFF",
    fontSize: "1rem",
    textAlign: "center",
    backgroundColor: "#3F51B5",
    "&:hover": {
      backgroundColor: "#303F9F",
    },
    "&:disabled": {
      backgroundColor: "#93A2F2",
      color: "#FFFFFF",
    },
  },
}))(Button);

export const GreenButton = withStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    textTransform: "none",
    color: "#FFFFFF",
    fontSize: "1rem",
    textAlign: "center",
    backgroundColor: "#47B14C",
    "&:hover": {
      backgroundColor: "#36973A",
    },
    "&:disabled": {
      backgroundColor: "#8CE190",
      color: "#FFFFFF",
    },
  },
}))(Button);

export const RedButton = withStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    textTransform: "none",
    color: "#FFFFFF",
    fontSize: "1rem",
    textAlign: "center",
    backgroundColor: "#DC004E",
    "&:hover": {
      backgroundColor: "#9A0036",
    },
    "&:disabled": {
      backgroundColor: "#FF8AB3",
      color: "#FFFFFF",
    },
  },
}))(Button);

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#3E3E3E",
    color: "#FFFFFF",
    border: 0,
    fontSize: "0.9rem",
    maxWidth: "6.8rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
  body: {
    fontSize: "0.85rem",
    maxWidth: "6.8rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
}))(TableCell);

export const StyledTableCellTiny = withStyles((theme) => ({
  head: {
    backgroundColor: "#3E3E3E",
    color: "#FFFFFF",
    border: 0,
    fontSize: "0.9rem",
    maxWidth: "8.5rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
  body: {
    fontSize: "0.85rem",
    maxWidth: "8.5rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
}))(TableCell);

export const StyledTableCellSuperTiny = withStyles((theme) => ({
  head: {
    backgroundColor: "#3E3E3E",
    color: "#FFFFFF",
    border: 0,
    fontSize: "0.9rem",
    maxWidth: "7rem",
    paddingLeft: "0.4rem",
    paddingRight: "0.4rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
  body: {
    fontSize: "0.8rem",
    maxWidth: "7rem",
    paddingLeft: "0.4rem",
    paddingRight: "0.4rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
}))(TableCell);

export const StyledTableCellBig = withStyles((theme) => ({
  head: {
    backgroundColor: "#3E3E3E",
    color: "#FFFFFF",
    border: 0,
    fontSize: "0.9rem",
    maxWidth: "20rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
  body: {
    fontSize: "0.9rem",
    maxWidth: "20rem",
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
}))(TableCell);

export const CustomChip = withStyles((theme) => ({
  root: {
    fontSize: "0.7rem",
    height: "1.5rem",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
}))(Chip);

export const CustomAutocomplete = withStyles((theme) => ({
  fullWidth: { display: "grid" },
  inputRoot: { width: "100%" },
  focused: {},
  tagSizeSmall: {
    overflow: "hidden",
    textOverflow: "clip",
    maxWidth: "5rem",
    "&:hover": {
      maxWidth: "min-content",
    },
  },
}))(Autocomplete);

export const StyledIconButton = withStyles((theme) => ({
  root: {
    margin: "0 0 0 0.5rem",
  },
}))(IconButton);

export const StyledTooltip = withStyles({
  tooltip: {
    padding: "8px 16px",
    fontSize: 12,
    margin: (props) => (props.lower ? "5px 0 0" : "-10px 0 0"),
  },
})(Tooltip);

export const CustomDateRangePicker = (props) => {
  const classes = useStyles(props.colors);
  const [openDiag, setOpenDiag] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    initial: "",
    final: "",
  });
  const [inputValue, setInputValue] = useState("");

  const onClose = () => {
    setOpenDiag(false);
  };

  useEffect(() => {
    let inputText = "";
    if (currentDate.initial && !currentDate.final) {
      inputText = "Desde " + currentDate.initial;
    }
    if (!currentDate.initial && currentDate.final) {
      inputText = "Hasta " + currentDate.final;
    }
    if (currentDate.initial && currentDate.final) {
      inputText = currentDate.initial + " al " + currentDate.final;
    }
    setInputValue(inputText || "");
  }, [currentDate]);

  useEffect(() => {
    setCurrentDate({
      initial: "",
      final: "",
    });
    if (props.value1?.getDate?.() && props.value2?.getDate?.()) {
      setCurrentDate({
        initial:
          (props.value1.getDate?.() < 10 ? "0" : "") +
          props.value1.getDate?.() +
          "/" +
          (props.value1.getMonth?.() + 1 < 10 ? "0" : "") +
          (props.value1.getMonth?.() + 1) +
          "/" +
          props.value1.getFullYear?.(),
        final:
          (props.value2.getDate?.() < 10 ? "0" : "") +
          props.value2.getDate?.() +
          "/" +
          (props.value2.getMonth?.() + 1 < 10 ? "0" : "") +
          (props.value2.getMonth?.() + 1) +
          "/" +
          props.value2.getFullYear?.(),
      });
    }
    if (props.value1?.getDate?.() && !props.value2?.getDate?.()) {
      setCurrentDate((prev) => ({
        ...prev,
        initial:
          (props.value1.getDate?.() < 10 ? "0" : "") +
          props.value1.getDate?.() +
          "/" +
          (props.value1.getMonth?.() + 1 < 10 ? "0" : "") +
          (props.value1.getMonth?.() + 1) +
          "/" +
          props.value1.getFullYear?.(),
      }));
    }
    if (!props.value1?.getDate?.() && props.value2?.getDate?.()) {
      setCurrentDate((prev) => ({
        ...prev,
        final:
          (props.value2.getDate?.() < 10 ? "0" : "") +
          props.value2.getDate?.() +
          "/" +
          (props.value2.getMonth?.() + 1 < 10 ? "0" : "") +
          (props.value2.getMonth?.() + 1) +
          "/" +
          props.value2.getFullYear?.(),
      }));
    }
  }, [props.value1, props.value2]);

  return (
    <Fragment>
      <FormControl
        style={props.formstyle}
        className={props.classesname}
        variant="outlined"
        margin="dense"
      >
        <InputLabel>{props.labelInput}</InputLabel>
        <OutlinedInput
          placeholder={"Abrir calendario"}
          readOnly
          margin="dense"
          labelWidth={120}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setOpenDiag((prev) => !prev)}
              >
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Dialog
        open={openDiag}
        onClose={onClose}
        PaperProps={{ className: classes.dateRangeDialog, elevation: 8 }}
      >
        <div className={classes.dateRangeContainer}>
          <div className={classes.dateRangePickersContainer}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                error={props.error || false}
                margin="dense"
                inputVariant="outlined"
                variant="inline"
                format="dd/MM/yyyy"
                label={props.label1}
                value={props.value1 || null}
                onChange={(date) => props.funct1(date)}
                invalidDateMessage={"Fecha inválida"}
                keyboardIcon={null}
                open={false}
                FormHelperTextProps={{
                  component: "div",
                  style: { position: "absolute", top: 4, right: 0 },
                }}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                format="dd/MM/yyyy"
                variant="static"
                value={props.value1 || null}
                onChange={(date) => props.funct1(date)}
              />
            </MuiPickersUtilsProvider>
          </div>
          <Divider
            orientation="vertical"
            className={classes.dateRangeDivider}
          />
          <div className={classes.dateRangePickersContainer}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                error={props.error || false}
                inputVariant="outlined"
                margin="dense"
                variant="inline"
                format="dd/MM/yyyy"
                label={props.label2}
                value={props.value2 || null}
                onChange={(date) => props.funct2(date)}
                invalidDateMessage={"Fecha inválida"}
                keyboardIcon={null}
                open={false}
                FormHelperTextProps={{
                  component: "div",
                  style: { position: "absolute", top: 4, right: 0 },
                }}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                format="dd/MM/yyyy"
                variant="static"
                value={props.value2 || null}
                onChange={(date) => props.funct2(date)}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
};
