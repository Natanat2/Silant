import React from "react";
import { Button } from "react-bootstrap";
import "../styles/buttons.css";

const Buttons = ({ isManager, onCreate, onEdit, onDelete }) => {
  return (
    <div className="buttons">
      {isManager && (
        <>
          <Button onClick={onCreate} style={{ marginRight: "10px" }}>
            Создать новую Машину
          </Button>
          <Button onClick={onEdit} style={{ marginRight: "10px" }}>
            Редактировать Машину
          </Button>
          <Button
            onClick={onDelete}
            variant="danger"
            style={{ marginRight: "10px" }}
          >
            Удалить Машину
          </Button>
        </>
      )}
    </div>
  );
};

export default Buttons;
