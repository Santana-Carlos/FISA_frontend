import React from "react";
import "./Dashboard.css";

const NotFound = () => {
  return (
    <div className="o-mainDashboard">
      <div
        className="o-mainDashboard-bigCard"
        style={{
          fontSize: "8rem",
        }}
      >
        404
        <div
          style={{
            fontSize: "4rem",
          }}
        >
          Not Found
        </div>
      </div>
    </div>
  );
};

export default NotFound;
