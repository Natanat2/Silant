import React from "react";
import { Modal, Button } from "react-bootstrap";
import MainForm from "./MainForm";

const MachineModal = ({
  showModal,
  handleClose,
  formData,
  setFormData,
  dependencies,
}) => {
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Редактирование машины</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MainForm
          formData={formData}
          handleChange={handleChange}
          dependencies={dependencies}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Закрыть
        </Button>
        <Button variant="primary">Сохранить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MachineModal;
