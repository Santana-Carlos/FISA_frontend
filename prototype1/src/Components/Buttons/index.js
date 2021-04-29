import { withStyles } from "@material-ui/core/styles";
import { Button, TableCell, Chip, IconButton } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

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
  focused: {},
  tagSizeSmall: {
    overflow: "hiiden",
    textOverflow: "clip",
    maxWidth: "5rem",
  },
}))(Autocomplete);

export const StyledIconButton = withStyles((theme) => ({
  root: {
    margin: "0 0 0 0.5rem",
  },
}))(IconButton);
