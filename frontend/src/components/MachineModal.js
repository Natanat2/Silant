import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const MachineModal = ({ showModal, handleClose, formData, setFormData }) => {
  const [isNewMachine, setIsNewMachine] = useState(true); // Флаг для создания новой машины

  const [localFormData, setLocalFormData] = useState({
    machine_factory_number: "",
    machine_model: "",
    engine_factory_number: "",
    engine_model: "",
    // другие поля
  });

  useEffect(() => {
    if (formData) {
      setIsNewMachine(false); // Если formData существует, то это редактирование
      setLocalFormData(formData); // Заполняем форму существующими данными
    } else {
      setIsNewMachine(true); // Если formData нет, это создание
      setLocalFormData({
        machine_factory_number: "",
        machine_model: "",
        engine_factory_number: "",
        engine_model: "",
        // другие поля
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Отсутствует токен");
        return;
      }

      if (isNewMachine) {
        // Создание новой машины
        await axios.post(
          "http://127.0.0.1:8000/api/service/machine/", // Укажите правильный URL для создания машины
          localFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Машина создана");
      } else {
        // Редактирование существующей машины
        await axios.put(
          `http://127.0.0.1:8000/api/service/${localFormData.id}/`, // Используем ID для обновления
          localFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Машина отредактирована");
      }

      // После отправки данных закрываем модальное окно
      handleClose();
    } catch (error) {
      console.error("Ошибка при сохранении данных", error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isNewMachine ? "Создать новую машину" : "Редактировать машину"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formMachineFactoryNumber">
            <Form.Label>Зав. № машины</Form.Label>
            <Form.Control
              type="text"
              name="machine_factory_number"
              value={localFormData.machine_factory_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Добавьте другие поля для новой машины, например модель машины, номер двигателя и т.д. */}

          <Button variant="primary" type="submit">
            {isNewMachine ? "Создать" : "Сохранить"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MachineModal;
