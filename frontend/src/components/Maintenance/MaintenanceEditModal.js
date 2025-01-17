import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Toast } from "react-bootstrap";
import axios from "axios";

const MaintenanceEditModal = ({ show, onClose, maintenanceData, onSave }) => {
  const [localFormData, setLocalFormData] = useState({});
  const [dependencies, setDependencies] = useState({
    typesOfMaintenance: [],
    organizations: [],
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка зависимостей
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Токен авторизации отсутствует");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/maintenance/types_of_maintenance/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDependencies({
          typesOfMaintenance: response.data.types_of_maintenance || [],
          organizations: response.data.organizations || [],
        });
      } catch (err) {
        console.error("Ошибка при загрузке зависимостей:", err);
        setError("Не удалось загрузить данные зависимостей.");
      }
    };

    fetchDependencies();
  }, []);

  // Обновление данных формы
  useEffect(() => {
    if (maintenanceData) {
      setLocalFormData({
        ...maintenanceData,
        type_of_maintenance: maintenanceData.type_of_maintenance.id,
        organization_carried_maintenance:
          maintenanceData.organization_carried_maintenance.id,
      });
    }
  }, [maintenanceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен авторизации отсутствует");
        return;
      }

      // Формируем данные для отправки
      const requestData = {
        id: maintenanceData.id, // ID записи
        machine: maintenanceData.machine.id, // ID машины
        type_of_maintenance: localFormData.type_of_maintenance, // Вид ТО
        organization_carried_maintenance: parseInt(
          localFormData.organization_carried_maintenance,
          10
        ), // Организация (ID)
        service_company_maintenance:
          maintenanceData.service_company_maintenance.id, // Сервисная компания (ID)
        date_of_maintenance: localFormData.date_of_maintenance, // Дата ТО
        operating_time: localFormData.operating_time, // Наработка
        order_number: localFormData.order_number, // Номер заказа
        order_date: localFormData.order_date, // Дата заказа
      };

      console.log("Данные для отправки:", requestData);

      await axios.put(
        `http://127.0.0.1:8000/api/maintenance/${maintenanceData.id}/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowSuccessToast(true);
      onSave(); // Вызываем метод обновления в родительском компоненте
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose(); // Закрываем модальное окно
      }, 500);
    } catch (error) {
      console.error("Ошибка при обновлении данных ТО:", error);
      setError(
        "Не удалось обновить данные ТО. Проверьте введенные данные и попробуйте снова."
      );
    }
  };

  return (
    <>
      <Toast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "10px 15px",
        }}
      >
        <Toast.Body>Данные ТО успешно обновлены!</Toast.Body>
      </Toast>

      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать ТО</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Вид ТО</Form.Label>
                  <Form.Select
                    name="type_of_maintenance"
                    value={localFormData.type_of_maintenance || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите вид ТО...</option>
                    {dependencies.typesOfMaintenance.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type_of_maintenance_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Дата ТО</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_maintenance"
                    value={localFormData.date_of_maintenance || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Наработка (м/час)</Form.Label>
                  <Form.Control
                    type="number"
                    name="operating_time"
                    value={localFormData.operating_time || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Номер заказа</Form.Label>
                  <Form.Control
                    type="text"
                    name="order_number"
                    value={localFormData.order_number || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Дата заказа</Form.Label>
                  <Form.Control
                    type="date"
                    name="order_date"
                    value={localFormData.order_date || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Организация</Form.Label>
                  <Form.Select
                    name="organization_carried_maintenance"
                    value={localFormData.organization_carried_maintenance || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите организацию...</option>
                    {dependencies.organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name_organization}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MaintenanceEditModal;
