import { withStyles } from "@material-ui/core/styles";
import { Button, TableCell, Chip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export const SideButton = withStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    textTransform: "none",
    color: "#FFFFFF",
    borderRadius: 0,
    fontSize: "1rem",
    fontWeight: 400,
    textAlign: "start",
    paddingLeft: "1.2rem",
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
  focused: {},
  tagSizeSmall: {
    overflow: "hiiden",
    textOverflow: "clip",
    maxWidth: "5rem",
  },
}))(Autocomplete);
