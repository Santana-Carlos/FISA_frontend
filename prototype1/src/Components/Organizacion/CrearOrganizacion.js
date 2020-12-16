import React from "react";
import { useSelector } from "react-redux";
import "../Styles.css";
import CrearOrganizacion1DatosBasicos from "./CrearOrganizacion1DatosBasicos";

const CrearOrganizacion = () => {
  const token = useSelector((state) => state.token);
  return (
    <CrearOrganizacion1DatosBasicos
      token={token}
      nueva_org={true}
      tipoid_org={""}
      nid_org={""}
      cat_org={""}
      nomcom_org={""}
      razsoc_org={""}
      pais_org={""}
      web_org={""}
      obs_org={""}
      fechaafi_org={""}
      motivoafi_org={""}
      fechadesafi_org={""}
      motivodesafi_org={""}
      tipo_org={""}
      clase_org={""}
      sectoreco_org={""}
      subsececo_org={""}
      empdir_org={""}
      empind_org={""}
      estado_org={""}
      ciiu_org={[]}
    />
  );
};

export default CrearOrganizacion;
