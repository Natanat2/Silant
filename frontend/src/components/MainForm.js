import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";

const MainForm = ({ formData, handleChange, dependencies }) => {
  return (
    <Form>
      <Row>
        <Col sm={12} md={6}>
          <Form.Group controlId="formMachineFactoryNumber">
            <Form.Label>Зав. № машины</Form.Label>
            <Form.Control
              type="text"
              value={formData.machineFactoryNumber}
              onChange={(e) =>
                handleChange("machineFactoryNumber", e.target.value)
              }
            />
          </Form.Group>
        </Col>
        {/* Другие поля формы, такие как модель техники, модель двигателя и т.д. */}
        <Col sm={12} md={6}>
          <Form.Group controlId="formMachineModel">
            <Form.Label>Модель техники</Form.Label>
            <Select
              options={dependencies.machineModels}
              value={formData.machineModel}
              onChange={(selectedOption) =>
                handleChange("machineModel", selectedOption)
              }
            />
          </Form.Group>
        </Col>
        {/* Продолжение для других полей... */}
      </Row>
    </Form>
  );
};

export default MainForm;
