import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateToken } from "../../Actions";
import Dashboard from "../Dashboard/Dashboard";

const Log = () => {
  const dispatch = useDispatch();
  const isLog = useSelector((state) => state.isLog);
  const token = useSelector((state) => state.token);
  if (isLog) {
    if (window.refreshToken !== undefined) {
      clearInterval(window.refreshToken);
    }
    window.refreshToken = setInterval(() => {
      fetch(process.env.REACT_APP_API_URL + "refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            //console.log("token refreshed");
            dispatch(updateToken(data.token));
          } else {
            alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
          }
        })
        .catch((error) => {
          alert("SERVIDOR NO DISPONIBLE\nConsulte a su gestor de servicios");
        });
    }, 2700000);
  }
  return <Dashboard />;
};

export default Log;
