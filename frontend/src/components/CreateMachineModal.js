import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
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

  // Получаем зависимости для создания машины
  const fetchDependencies = async () => {
    setLoading(true);
    try {
      // Получаем токен из localStorage
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("Отсутствует токен");
        return;
      }

      // Отправляем запрос с токеном в заголовке Authorization
      const response = await axios.get(
        "http://127.0.0.1:8000/api/service/machine-dependencies",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
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

  // Обновляем formData по умолчанию
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика отправки формы
    console.log(formData);
    handleClose(); // Закрытие модального окна после отправки
  };

  // Убедимся, что formData всегда инициализировано
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
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Создание машины</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Зав. № машины */}
          <Form.Group className="mb-3" controlId="formMachineFactoryNumber">
            <Form.Label>Зав. № машины</Form.Label>
            <Form.Control
              type="text"
              name="machine_factory_number"
              value={machine_factory_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Модель машины */}
          <Form.Group className="mb-3" controlId="formMachineModel">
            <Form.Label>Модель машины</Form.Label>
            <Form.Control
              as="select"
              name="machine_model"
              value={machine_model}
              onChange={handleChange}
              required
            >
              <option value="">Выберите модель машины</option>
              {dependencies.machineModels.length > 0 ? (
                dependencies.machineModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.machine_model_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* Зав. № двигателя */}
          <Form.Group className="mb-3" controlId="formEngineFactoryNumber">
            <Form.Label>Зав. № двигателя</Form.Label>
            <Form.Control
              type="text"
              name="engine_factory_number"
              value={engine_factory_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Модель двигателя */}
          <Form.Group className="mb-3" controlId="formEngineModel">
            <Form.Label>Модель двигателя</Form.Label>
            <Form.Control
              as="select"
              name="engine_model"
              value={engine_model}
              onChange={handleChange}
              required
            >
              <option value="">Выберите модель двигателя</option>
              {dependencies.engineModels.length > 0 ? (
                dependencies.engineModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.engine_model_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* Зав. № трансмиссии */}
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

          {/* Модель трансмиссии */}
          <Form.Group className="mb-3" controlId="formTransmissionModel">
            <Form.Label>Модель трансмиссии</Form.Label>
            <Form.Control
              as="select"
              name="transmission_model"
              value={transmission_model}
              onChange={handleChange}
              required
            >
              <option value="">Выберите модель трансмиссии</option>
              {dependencies.transmissionModels.length > 0 ? (
                dependencies.transmissionModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.transmission_model_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* Зав. № ведущего моста */}
          <Form.Group className="mb-3" controlId="formLeadBridgeFactoryNumber">
            <Form.Label>Зав. № ведущего моста</Form.Label>
            <Form.Control
              type="text"
              name="lead_bridge_factory_number"
              value={lead_bridge_factory_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Модель ведущего моста */}
          <Form.Group className="mb-3" controlId="formLeadBridgeModel">
            <Form.Label>Модель ведущего моста</Form.Label>
            <Form.Control
              as="select"
              name="lead_bridge_model"
              value={lead_bridge_model}
              onChange={handleChange}
              required
            >
              <option value="">Выберите модель ведущего моста</option>
              {dependencies.leadBridgeModels.length > 0 ? (
                dependencies.leadBridgeModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.lead_bridge_model_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* Зав. № управляемого моста */}
          <Form.Group
            className="mb-3"
            controlId="formControlledBridgeFactoryNumber"
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

          {/* Модель управляемого моста */}
          <Form.Group className="mb-3" controlId="formControlledBridgeModel">
            <Form.Label>Модель управляемого моста</Form.Label>
            <Form.Control
              as="select"
              name="controlled_bridge_model"
              value={controlled_bridge_model}
              onChange={handleChange}
              required
            >
              <option value="">Выберите модель управляемого моста</option>
              {dependencies.controlledBridgeModels.length > 0 ? (
                dependencies.controlledBridgeModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.controlled_bridge_model_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* Дата отгрузки с завода */}
          <Form.Group className="mb-3" controlId="formFactoryShippingDate">
            <Form.Label>Дата отгрузки с завода</Form.Label>
            <Form.Control
              type="date"
              name="factory_shipping_date"
              value={factory_shipping_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Потребитель */}
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

          {/* Клиент */}
          <Form.Group className="mb-3" controlId="formClient">
            <Form.Label>Клиент</Form.Label>
            <Form.Control
              as="select"
              name="client"
              value={client}
              onChange={handleChange}
              required
            >
              <option value="">Выберите клиента</option>
              {dependencies.clients.length > 0 ? (
                dependencies.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.user_full_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* Компания обслуживания */}
          <Form.Group className="mb-3" controlId="formServiceCompany">
            <Form.Label>Компания обслуживания</Form.Label>
            <Form.Control
              as="select"
              name="service_company"
              value={service_company}
              onChange={handleChange}
              required
            >
              <option value="">Выберите компанию обслуживания</option>
              {dependencies.serviceCompanies.length > 0 ? (
                dependencies.serviceCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.user_full_name}
                  </option>
                ))
              ) : (
                <option>Загрузка...</option>
              )}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Создать"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMachineModal;
