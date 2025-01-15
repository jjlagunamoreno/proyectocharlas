import React from "react";
import { useNavigate } from "react-router-dom";

const NuevaCharla = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/rondas");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button className="btn btn-back" onClick={goBack}>
        ←
      </button>
      <h1>Nueva Charla</h1>
      <p>Aquí podrás crear una nueva charla.</p>
    </div>
  );
};

export default NuevaCharla;
