import React from "react";
import "../styles/panel.css";
import CurrentUser from "./userinfo";
import { ButtonGroup, Button } from "react-bootstrap";

const Panel = () => {
  return (
    <div className="userinfo">
      <CurrentUser />
      <h4>
        Информация о комплектации и технических характеристиках Вашей техники
      </h4>

      <ButtonGroup aria-label="Basic example">
        <Button variant="primary">Left</Button>
        <Button variant="primary">Middle</Button>
        <Button variant="primary">Right</Button>
      </ButtonGroup>
    </div>
  );
};

export default Panel;
