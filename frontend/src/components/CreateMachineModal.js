import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Toast } from "react-bootstrap";
import axios from "axios";
import "../styles/createmachinemodal.css";

const CreateMachineModal = ({
  showModal,
  handleClose,
  formData,
  setFormData,
  onMachineCreated,
}) => {
  const [dependencies, setDependencies] = useState({
    machineModels: [],
    engineModels: [],
    transmissionModels: [],
    leadBridgeModels: [],
    controlledBridgeModels: [],
    clients: [],
    serviceCompanies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен авторизации отсутствует");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/service/machine_dependencies",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDependencies({
        machineModels: response.data.machine_models,
        engineModels: response.data.engine_models,
        transmissionModels: response.data.transmission_models,
        leadBridgeModels: response.data.lead_bridge_models,
        controlledBridgeModels: response.data.controlled_bridge_models,
        clients: response.data.clients,
        serviceCompanies: response.data.service_companies,
      });
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке зависимостей", error);
      setError("Не удалось загрузить зависимости");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

      await axios.post("http://127.0.0.1:8000/api/service/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setShowSuccessToast(true); // Показываем уведомление об успешном создании
      handleClose(); // Закрываем модальное окно
    } catch (error) {
      console.error("Ошибка при создании машины:", error);
      setError(
        "Не удалось создать машину. Проверьте данные и попробуйте снова."
      );
    }
  };

  const safeFormData = formData || {};

  return (
    <>
      {/* Уведомление об успешном создании */}
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
        <Toast.Body>Машина успешно сохранена!</Toast.Body>
      </Toast>

      {/* Модальное окно */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Создание машины</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Загрузка...</p>
            </div>
          ) : (
            <>
              {error && <div className="alert alert-danger">{error}</div>}

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Левая колонка */}
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Зав. № машины</Form.Label>
                      <Form.Control
                        type="text"
                        name="machine_factory_number"
                        value={safeFormData.machine_factory_number || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Модель машины</Form.Label>
                      <Form.Select
                        name="machine_model"
                        value={safeFormData.machine_model || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите модель...</option>
                        {dependencies.machineModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.machine_model_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Зав. № двигателя</Form.Label>
                      <Form.Control
                        type="text"
                        name="engine_factory_number"
                        value={safeFormData.engine_factory_number || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Модель двигателя</Form.Label>
                      <Form.Select
                        name="engine_model"
                        value={safeFormData.engine_model || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите модель...</option>
                        {dependencies.engineModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.engine_model_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Зав. № трансмиссии</Form.Label>
                      <Form.Control
                        type="text"
                        name="transmission_factory_number"
                        value={safeFormData.transmission_factory_number || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Модель трансмиссии</Form.Label>
                      <Form.Select
                        name="transmission_model"
                        value={safeFormData.transmission_model || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите модель...</option>
                        {dependencies.transmissionModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.transmission_model_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Зав. № ведущего моста</Form.Label>
                      <Form.Control
                        type="text"
                        name="lead_bridge_factory_number"
                        value={safeFormData.lead_bridge_factory_number || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Модель ведущего моста</Form.Label>
                      <Form.Select
                        name="lead_bridge_model"
                        value={safeFormData.lead_bridge_model || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите модель...</option>
                        {dependencies.leadBridgeModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.lead_bridge_model_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>

                  {/* Правая колонка */}
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Зав. № управляемого моста</Form.Label>
                      <Form.Control
                        type="text"
                        name="controlled_bridge_factory_number"
                        value={
                          safeFormData.controlled_bridge_factory_number || ""
                        }
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Модель управляемого моста</Form.Label>
                      <Form.Select
                        name="controlled_bridge_model"
                        value={safeFormData.controlled_bridge_model || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите модель...</option>
                        {dependencies.controlledBridgeModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.controlled_bridge_model_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Дата отгрузки с завода</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_shipment_from_factory"
                        value={safeFormData.date_shipment_from_factory || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Адрес доставки</Form.Label>
                      <Form.Control
                        type="text"
                        name="delivery_address"
                        value={safeFormData.delivery_address || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Номер договора поставки</Form.Label>
                      <Form.Control
                        type="text"
                        name="supply_contract_number_date"
                        value={safeFormData.supply_contract_number_date || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Потребитель</Form.Label>
                      <Form.Control
                        type="text"
                        name="consumer"
                        value={safeFormData.consumer || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Комплектация</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="configuration"
                        value={safeFormData.configuration || ""}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Клиент</Form.Label>
                      <Form.Select
                        name="client"
                        value={safeFormData.client || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите клиента...</option>
                        {dependencies.clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.user_full_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Компания обслуживания</Form.Label>
                      <Form.Select
                        name="service_company"
                        value={safeFormData.service_company || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите компанию...</option>
                        {dependencies.serviceCompanies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.user_full_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateMachineModal;
