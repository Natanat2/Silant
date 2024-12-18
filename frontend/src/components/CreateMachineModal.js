import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";

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

      if (!token) {
        console.error("Отсутствует токен");
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/service/machine-dependencies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  const {
    machine_factory_number = "",
    machine_model = "",
    engine_factory_number = "",
    engine_model = "",
    transmission_factory_number = "",
    transmission_model = "",
    lead_bridge_factory_number = "",
    lead_bridge_model = "",
    controlled_bridge_factory_number = "",
    controlled_bridge_model = "",
    factory_shipping_date = "",
    consumer = "",
    client = "",
    service_company = "",
  } = safeFormData;

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
              {/* Левая колонка */}
              <div className="col-md-6">
                <Form.Group
                  className="mb-3"
                  controlId="formMachineFactoryNumber"
                >
                  <Form.Label>Зав. № машины</Form.Label>
                  <Form.Control
                    type="text"
                    name="machine_factory_number"
                    value={machine_factory_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMachineModel">
                  <Form.Label>Модель машины</Form.Label>
                  <Form.Select
                    name="machine_model"
                    value={machine_model}
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

                <Form.Group
                  className="mb-3"
                  controlId="formTransmissionFactoryNumber"
                >
                  <Form.Label>Зав. № трансмиссии</Form.Label>
                  <Form.Control
                    type="text"
                    name="transmission_factory_number"
                    value={transmission_factory_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLeadBridgeNumber">
                  <Form.Label>Зав. № ведущего моста</Form.Label>
                  <Form.Control
                    type="text"
                    name="lead_bridge_factory_number"
                    value={lead_bridge_factory_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConsumer">
                  <Form.Label>Потребитель</Form.Label>
                  <Form.Control
                    type="text"
                    name="consumer"
                    value={consumer}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              {/* Правая колонка */}
              <div className="col-md-6">
                <Form.Group
                  className="mb-3"
                  controlId="formEngineFactoryNumber"
                >
                  <Form.Label>Зав. № двигателя</Form.Label>
                  <Form.Control
                    type="text"
                    name="engine_factory_number"
                    value={engine_factory_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEngineModel">
                  <Form.Label>Модель двигателя</Form.Label>
                  <Form.Select
                    name="engine_model"
                    value={engine_model}
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

                <Form.Group
                  className="mb-3"
                  controlId="formControlledBridgeNumber"
                >
                  <Form.Label>Зав. № управляемого моста</Form.Label>
                  <Form.Control
                    type="text"
                    name="controlled_bridge_factory_number"
                    value={controlled_bridge_factory_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formClient">
                  <Form.Label>Клиент</Form.Label>
                  <Form.Select
                    name="client"
                    value={client}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите клиента...</option>
                    {dependencies.clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formServiceCompany">
                  <Form.Label>Сервисная компания</Form.Label>
                  <Form.Select
                    name="service_company"
                    value={service_company}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите компанию...</option>
                    {dependencies.serviceCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
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
