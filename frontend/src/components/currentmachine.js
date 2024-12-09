import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Table, Button, Form, Modal } from "react-bootstrap";
import "../styles/currentmachine.css";

const CurrentMachine = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [machineData, setMachineData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({}); // Для хранения данных формы

  // Получение данных машины
  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/service/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        const data = await response.json();
        setMachineData(data);
        setFormData(data); // Инициализация формы данными
      } catch (error) {
        console.error("Ошибка:", error);
        setMachineData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachineData();
  }, [id]);

  // Обновление записи
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/service/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении данных");
      }

      const updatedData = await response.json();
      setMachineData(updatedData);
      setShowEditModal(false); // Закрыть модальное окно
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  // Удаление записи
  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту машину?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/service/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при удалении");
        }

        alert("Машина успешно удалена");
        // Перенаправить обратно на список машин
        window.location.href = "/machines";
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };

  // Обработка изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!machineData) {
    return <div>Данные не найдены</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Данные о машине</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Параметр</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Зав. № машины</td>
            <td>{machineData.machine_factory_number}</td>
          </tr>
          <tr>
            <td>Модель машины</td>
            <td>{machineData.machine_model.machine_model_name}</td>
          </tr>
          <tr>
            <td>Зав. № двигателя</td>
            <td>{machineData.engine_factory_number}</td>
          </tr>
          <tr>
            <td>Модель двигателя</td>
            <td>{machineData.engine_model.engine_model_name}</td>
          </tr>
          <tr>
            <td>Модель трансмиссии</td>
            <td>{machineData.transmission_model.transmission_model_name}</td>
          </tr>
          <tr>
            <td>Зав. № трансмиссии</td>
            <td>{machineData.transmission_factory_number}</td>
          </tr>
          <tr>
            <td>Модель ведущего моста</td>
            <td>{machineData.lead_bridge_model.lead_bridge_model_name}</td>
          </tr>
          <tr>
            <td>Зав. № ведущего моста</td>
            <td>{machineData.lead_bridge_factory_number}</td>
          </tr>
          <tr>
            <td>Модель управляемого моста</td>
            <td>
              {machineData.controlled_bridge_model.controlled_bridge_model_name}
            </td>
          </tr>
          <tr>
            <td>Зав. № управляемого моста</td>
            <td>{machineData.controlled_bridge_factory_number}</td>
          </tr>
        </tbody>
      </Table>

      <Button variant="primary" onClick={() => setShowEditModal(true)}>
        Редактировать
      </Button>
      <Button variant="danger" className="ms-2" onClick={handleDelete}>
        Удалить
      </Button>

      {/* Модальное окно для редактирования */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Редактирование данных</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMachineFactoryNumber">
              <Form.Label>Зав. № машины</Form.Label>
              <Form.Control
                type="text"
                name="machine_factory_number"
                value={formData.machine_factory_number || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEngineFactoryNumber">
              <Form.Label>Зав. № двигателя</Form.Label>
              <Form.Control
                type="text"
                name="engine_factory_number"
                value={formData.engine_factory_number || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEngineModel">
              <Form.Label>Модель двигателя</Form.Label>
              <Form.Control
                type="text"
                name="engine_model"
                value={formData.engine_model?.engine_model_name || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTransmissionModel">
              <Form.Label>Модель трансмиссии</Form.Label>
              <Form.Control
                type="text"
                name="transmission_model"
                value={
                  formData.transmission_model?.transmission_model_name || ""
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTransmissionFactoryNumber">
              <Form.Label>Зав. № трансмиссии</Form.Label>
              <Form.Control
                type="text"
                name="transmission_factory_number"
                value={formData.transmission_factory_number || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLeadBridgeModel">
              <Form.Label>Модель ведущего моста</Form.Label>
              <Form.Control
                type="text"
                name="lead_bridge_model"
                value={formData.lead_bridge_model?.lead_bridge_model_name || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLeadBridgeFactoryNumber">
              <Form.Label>Зав. № ведущего моста</Form.Label>
              <Form.Control
                type="text"
                name="lead_bridge_factory_number"
                value={formData.lead_bridge_factory_number || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formControlledBridgeModel">
              <Form.Label>Модель управляемого моста</Form.Label>
              <Form.Control
                type="text"
                name="controlled_bridge_model"
                value={
                  formData.controlled_bridge_model
                    ?.controlled_bridge_model_name || ""
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formControlledBridgeFactoryNumber">
              <Form.Label>Зав. № управляемого моста</Form.Label>
              <Form.Control
                type="text"
                name="controlled_bridge_factory_number"
                value={formData.controlled_bridge_factory_number || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CurrentMachine;
