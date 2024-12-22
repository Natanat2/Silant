import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Toast } from "react-bootstrap";
import axios from "axios";

const MaintenanceEditModal = ({
  showModal,
  handleClose,
  maintenanceData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [dependencies, setDependencies] = useState({
    maintenanceTypes: [],
    organizations: [],
  });

  useEffect(() => {
    if (maintenanceData) {
      setFormData({
        ...maintenanceData,
        type_of_maintenance: maintenanceData.type_of_maintenance.id,
        organization_carried_maintenance:
          maintenanceData.organization_carried_maintenance.id,
      });
    }
  }, [maintenanceData]);

  const fetchDependencies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/maintenance/dependencies/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDependencies({
        maintenanceTypes: response.data.maintenance_types,
        organizations: response.data.organizations,
      });
    } catch (err) {
      console.error("Ошибка при загрузке зависимостей ТО:", err);
      setError("Не удалось загрузить данные. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.put(
        `http://127.0.0.1:8000/api/maintenance/${formData.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowSuccessToast(true);
      onUpdate(); // Callback для обновления данных в таблице
      handleClose();
    } catch (err) {
      console.error("Ошибка при обновлении ТО:", err);
      setError("Не удалось обновить данные. Проверьте введенные значения.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Уведомление об успешном обновлении */}
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
        <Toast.Body>ТО успешно обновлено!</Toast.Body>
      </Toast>

      {/* Модальное окно */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать ТО</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Загрузка...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Вид ТО</Form.Label>
                <Form.Select
                  name="type_of_maintenance"
                  value={formData.type_of_maintenance || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите вид ТО...</option>
                  {dependencies.maintenanceTypes.map((type) => (
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
                  value={formData.date_of_maintenance || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Наработка (м/час)</Form.Label>
                <Form.Control
                  type="number"
                  name="operating_time"
                  value={formData.operating_time || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Номер заказа</Form.Label>
                <Form.Control
                  type="text"
                  name="order_number"
                  value={formData.order_number || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Дата заказа</Form.Label>
                <Form.Control
                  type="date"
                  name="order_date"
                  value={formData.order_date || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Организация</Form.Label>
                <Form.Select
                  name="organization_carried_maintenance"
                  value={formData.organization_carried_maintenance || ""}
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

              <Button variant="primary" type="submit" className="w-100">
                Сохранить изменения
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MaintenanceEditModal;
