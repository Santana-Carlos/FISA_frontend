import React, { Component } from "react";
import { saveAs } from "file-saver";
import {
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
  Delete as IconDelete,
  Publish as IconUpload,
  GetApp as IconDownload,
} from "@material-ui/icons";
import {
  BlueButton,
  GreenButton,
  RedButton,
  StyledTableCell,
  StyledTableCellBig,
  StyledIconButton as IconButton,
} from "../Buttons";
import { Link } from "react-router-dom";
import TxtIcon from "../../Assets/01_ext.png";
import DocIcon from "../../Assets/02_ext.png";
import DocxIcon from "../../Assets/03_ext.png";
import XlsIcon from "../../Assets/04_ext.png";
import XlsxIcon from "../../Assets/05_ext.png";
import CsvIcon from "../../Assets/06_ext.png";
import PdfIcon from "../../Assets/07_ext.png";
import JpgIcon from "../../Assets/08_ext.png";
import JpegIcon from "../../Assets/09_ext.png";
import PngIcon from "../../Assets/10_ext.png";
import "../Styles.css";

const iconos = [
  TxtIcon,
  DocIcon,
  DocxIcon,
  XlsIcon,
  XlsxIcon,
  CsvIcon,
  PdfIcon,
  JpgIcon,
  JpegIcon,
  PngIcon,
];
const exts = [
  "txt",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "pdf",
  "jpg",
  "jpeg",
  "png",
];

class Consultar5Files extends Component {
  constructor(props) {
    super();
    this.state = {
      dbid_org: props.dbid_org,
      token: props.token,
      temp_files_fil: "",
      temp_id_fil: "",
      files: [],
      delFile: false,
      createS: false,
      loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.callAPi();
  }

  callAPi = () => {
    const data = {
      organizacion_id: this.state.dbid_org,
    };
    fetch(process.env.REACT_APP_API_URL + "Archivo/Org", {
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
            files: data.archivos,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleClickOpenDel = () => {
    this.setState({ delFile: true });
  };

  callAPiDownload = () => {
    this.setState({ loading: true });
    const nameFile = this.state.files[
      this.state.files.findIndex((x) => x.id === this.state.temp_id_fil)
    ].nombre;
    const idFile = this.state.temp_id_fil;
    fetch(process.env.REACT_APP_API_URL + "Archivo/" + idFile, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        this.setState({ loading: false });
        saveAs(data, nameFile);
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleCloseDel = (a) => {
    const idFile = this.state.temp_id_fil;
    if (a) {
      this.setState({ loading: true });
      fetch(process.env.REACT_APP_API_URL + "Archivo/" + idFile, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {})
        .catch((error) => {});
    }
    this.setState({
      delFile: false,
      temp_id_fil: "",
    });
    setTimeout(this.callAPi, 2000);
    setTimeout(this.callAPi, 5000);
  };

  handleChange(event) {
    let name = event.target.name;
    const files = event.target.files[0];

    switch (name) {
      case "input_file_fil":
        if (files !== undefined && files !== null && files !== "") {
          this.setState({ temp_files_fil: files }, this.callApiUpFile);
        }
        break;
      default:
        break;
    }
  }

  callApiUpFile = () => {
    this.setState({ loading: true });
    const fileTemp = this.state.temp_files_fil;

    if (fileTemp.size < 5300000) {
      const data = new FormData();
      data.append("file", this.state.temp_files_fil);
      data.append("organizacion_id", this.state.dbid_org);

      console.log(data);

      fetch(process.env.REACT_APP_API_URL + "Archivo/Upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({ loading: false, createS: true });
        });
      setTimeout(this.callAPi, 2000);
      setTimeout(this.callAPi, 5000);
    } else {
      this.setState({ createS: true });
    }
  };

  render() {
    const BOX_SIZE = this.props.box_size;
    return (
      <div className="o-cardContent">
        <div className="o-contentTittle">
          <h3 className="o-contentTittle-principal">Lista de archivos</h3>
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
        <div className="o-contentTittle-sub" style={{ marginTop: "1rem" }}>
          {"Tamaño máximo: 5MB"}
        </div>
        <div
          className="o-contentTittle-sub"
          style={{ marginTop: "0.5rem", marginBottom: "0.2rem" }}
        >
          {"Archivos permitidos:"}
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "0.2rem" }}
        >
          {iconos.map((obj, i) => (
            <img
              style={{ marginRight: "0.8rem", maxHeight: "3rem" }}
              key={i}
              src={obj}
              alt="icono"
            />
          ))}
        </div>
        <div className="o-contentForm-big">
          <div className="o-tableContainer">
            <TableContainer
              className="o-tableBase-files"
              style={{ maxHeight: BOX_SIZE }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCellBig>Nombre</StyledTableCellBig>
                    <StyledTableCell>Tipo</StyledTableCell>
                    <StyledTableCell>Creación</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.files.map((obj, i) => (
                    <TableRow key={i} hover={true}>
                      <StyledTableCellBig size="small">
                        {obj.nombre}
                      </StyledTableCellBig>
                      <StyledTableCell size="small">
                        <img
                          style={{ maxHeight: "2rem" }}
                          key={i}
                          src={iconos[exts.findIndex((x) => x === obj.tipo)]}
                          alt="icono"
                        />
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {obj.creacion}
                      </StyledTableCell>
                      <StyledTableCell size="small" align="right">
                        <div className="o-row-btnIcon">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              this.setState(
                                { temp_id_fil: obj.id },
                                this.callAPiDownload
                              )
                            }
                          >
                            <IconDownload />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              this.setState(
                                { temp_id_fil: obj.id },
                                this.handleClickOpenDel
                              )
                            }
                          >
                            <IconDelete />
                          </IconButton>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  {this.state.files[0] === undefined ? (
                    <TableRow>
                      <StyledTableCell>...</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="o-btnAnadirTable">
              <BlueButton variant="contained" component="label">
                Subir
                <IconUpload style={{ marginLeft: "0.5rem" }} size="small" />
                <input
                  type="file"
                  name="input_file_fil"
                  onChange={this.handleChange}
                  hidden
                />
              </BlueButton>
            </div>
          </div>
        </div>
        <div className="o-btnBotNav">
          <div style={{ color: "#FFFFFF" }}>{"Me encontraste!"}</div>
          <Link
            exact={"true"}
            to="/consultar_organizacion/editar"
            className="o-btnBotNav-btn"
          >
            <BlueButton>Volver</BlueButton>
          </Link>
        </div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.delFile}
          onClose={() => this.handleCloseDel(false)}
          maxWidth={false}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            ¿Desea eliminar el archivo?
          </DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <div className="o-btnBotNav-btnDiag3">
              <RedButton onClick={() => this.handleCloseDel(true)}>
                Eliminar
              </RedButton>
            </div>
            <div className="o-btnBotNav-btnDiag3">
              <GreenButton onClick={() => this.handleCloseDel(false)}>
                Cancelar
              </GreenButton>
            </div>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.createS} maxWidth={false}>
          <DialogTitle style={{ textAlign: "center" }}>
            {"El archivo no se pudo subir"}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            (Tipo de archivo inválido o demasiado pesado)
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

export default Consultar5Files;
