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
    window.refreshToken = setInterval(() => {
      fetch("http://localhost:8000/api/auth/refresh", {
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
            dispatch(updateToken(data.token));
          } else {
            alert("Servidor desconectado");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, 3600000);
  }
  return <Dashboard />;
};

export default Log;
