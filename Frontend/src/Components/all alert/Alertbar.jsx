
import React from "react";
import Alert from "react-bootstrap/Alert";

function Alertbar({ message }) {
  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999, minWidth: "250px" }}>
      <Alert variant="danger">{message}</Alert>
    </div>
  );
}

export default Alertbar;
