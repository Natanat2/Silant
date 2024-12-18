import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import "../styles/createmachinemodal.css";

const CreateMachineModal = ({
  showModal,
  handleClose,
  formData,
  setFormData,
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

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return console.error("Отсутствует токен");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/service/machine-dependencies",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    handleClose();
  };

  const safeFormData = formData || {};

  return (
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
          <Form onSubmit={handleSubmit}>
            <div className="row">
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Модель двигателя</Form.Label>
                  <Form.Select
                    name="engine_model"
                    value={safeFormData.engine_model || ""}
                    onChange={handleChange}
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Модель трансмиссии</Form.Label>
                  <Form.Select
                    name="transmission_model"
                    value={safeFormData.transmission_model || ""}
                    onChange={handleChange}
                  >
                    <option value="">Выберите модель...</option>
                    {dependencies.transmissionModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.transmission_model_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Зав. № ведущего моста</Form.Label>
                  <Form.Control
                    type="text"
                    name="lead_bridge_factory_number"
                    value={safeFormData.lead_bridge_factory_number || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Модель ведущего моста</Form.Label>
                  <Form.Select
                    name="lead_bridge_model"
                    value={safeFormData.lead_bridge_model || ""}
                    onChange={handleChange}
                  >
                    <option value="">Выберите модель...</option>
                    {dependencies.leadBridgeModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.lead_bridge_model_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Зав. № управляемого моста</Form.Label>
                  <Form.Control
                    type="text"
                    name="controlled_bridge_factory_number"
                    value={safeFormData.controlled_bridge_factory_number || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Модель управляемого моста</Form.Label>
                  <Form.Select
                    name="controlled_bridge_model"
                    value={safeFormData.controlled_bridge_model || ""}
                    onChange={handleChange}
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
                    name="factory_shipping_date"
                    value={safeFormData.factory_shipping_date || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Потребитель</Form.Label>
                  <Form.Control
                    type="text"
                    name="consumer"
                    value={safeFormData.consumer || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Клиент</Form.Label>
                  <Form.Select
                    name="client"
                    value={safeFormData.client || ""}
                    onChange={handleChange}
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
  );
};

export default CreateMachineModal;
