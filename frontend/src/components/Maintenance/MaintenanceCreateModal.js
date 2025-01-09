import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Toast, Spinner } from "react-bootstrap";
import axios from "axios";

const MaintenanceCreateModal = ({
  show,
  onClose,
  onSave,
  machineFactoryNumber,
  serviceCompanyId, // ID текущей сервисной компании
}) => {
  const [localFormData, setLocalFormData] = useState({
    type_of_maintenance: "",
    date_of_maintenance: "",
    operating_time: "",
    order_number: "",
    order_date: "",
    organization_carried_maintenance: "",
  });
  const [dependencies, setDependencies] = useState({
    maintenanceTypes: [],
    serviceCompanies: [],
  });
  const [loading, setLoading] = useState(false);
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

        const [typesResponse, companiesResponse] = await Promise.all([
          axios.get(
            "http://127.0.0.1:8000/api/maintenance/types_of_maintenance/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get("http://127.0.0.1:8000/api/service/machine_dependencies", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDependencies({
          maintenanceTypes: typesResponse.data || [],
          serviceCompanies: companiesResponse.data.service_companies || [],
        });
      } catch (err) {
        console.error("Ошибка при загрузке зависимостей:", err);
        setError("Не удалось загрузить данные зависимостей.");
      }
    };

    fetchDependencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен авторизации отсутствует");
        setLoading(false);
        return;
      }

      const requestData = {
        ...localFormData,
        machine: machineFactoryNumber, // Добавляем ID машины
        service_company_maintenance: serviceCompanyId, // Добавляем ID сервисной компании
      };

      await axios.post(`http://127.0.0.1:8000/api/maintenance/`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setShowSuccessToast(true);
      onSave();
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Ошибка при создании ТО:", error);
      setError(
        "Не удалось создать ТО. Проверьте введенные данные и попробуйте снова."
      );
    } finally {
      setLoading(false);
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
        <Toast.Body>ТО успешно создано!</Toast.Body>
      </Toast>

      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Создать ТО</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Загрузка...</p>
            </div>
          ) : (
            <div>
              {error && <div className="alert alert-danger">{error}</div>}

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Вид ТО</Form.Label>
                      <Form.Select
                        name="type_of_maintenance"
                        value={localFormData.type_of_maintenance}
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
                        value={localFormData.date_of_maintenance}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Наработка (м/час)</Form.Label>
                      <Form.Control
                        type="number"
                        name="operating_time"
                        value={localFormData.operating_time}
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
                        value={localFormData.order_number}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Дата заказа</Form.Label>
                      <Form.Control
                        type="date"
                        name="order_date"
                        value={localFormData.order_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Организация</Form.Label>
                      <Form.Select
                        name="organization_carried_maintenance"
                        value={localFormData.organization_carried_maintenance}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите организацию...</option>
                        {dependencies.serviceCompanies.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.user_full_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="row w-100">
            <div className="col-md-12">
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="w-100"
              >
                Сохранить изменения
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MaintenanceCreateModal;
