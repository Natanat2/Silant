import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Table, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/currentmachine.css";

const CurrentMachine = () => {
  const { id } = useParams();
  const [machineData, setMachineData] = useState(null);
  const [dependencies, setDependencies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const machineResponse = await fetch(
          `http://127.0.0.1:8000/api/service/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const dependenciesResponse = await fetch(
          `http://127.0.0.1:8000/api/service/machine-dependencies`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!machineResponse.ok || !dependenciesResponse.ok) {
          throw new Error("Ошибка при загрузке данных");
        }

        const machineData = await machineResponse.json();
        const dependenciesData = await dependenciesResponse.json();

        setMachineData(machineData);
        setDependencies(dependenciesData);
        setFormData(machineData); // Устанавливаем данные формы
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachineData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date_shipment_from_factory: date,
    }));
  };

  const handleSaveChanges = async () => {
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
        throw new Error("Ошибка при сохранении изменений");
      }

      const updatedData = await response.json();
      setMachineData(updatedData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!machineData || !dependencies) {
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
            <td>Модель техники</td>
            <td>{machineData.machine_model.machine_model_name}</td>
          </tr>
          <tr>
            <td>Модель двигателя</td>
            <td>{machineData.engine_model.engine_model_name}</td>
          </tr>
          <tr>
            <td>Зав. № двигателя</td>
            <td>{machineData.engine_factory_number}</td>
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
          <tr>
            <td>Договор поставки №, дата</td>
            <td>{machineData.supply_contract_number_date}</td>
          </tr>
          <tr>
            <td>Дата отгрузки с завода</td>
            <td>{machineData.date_shipment_from_factory}</td>
          </tr>
          <tr>
            <td>Грузополучатель</td>
            <td>{machineData.consumer}</td>
          </tr>
          <tr>
            <td>Адрес поставки</td>
            <td>{machineData.delivery_address}</td>
          </tr>
          <tr>
            <td>Комплектация</td>
            <td>{machineData.configuration}</td>
          </tr>
        </tbody>
      </Table>
      <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
        Редактировать
      </Button>

      <Modal
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
        className="modal-edit-machine"
      >
        <Modal.Header closeButton>
          <Modal.Title>Редактировать данные</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="machineFactoryNumber">
              <Form.Label>Зав. № машины</Form.Label>
              <Form.Control
                type="text"
                name="machine_factory_number"
                value={formData.machine_factory_number || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="machineModel">
              <Form.Label>Модель техники</Form.Label>
              <Form.Select
                name="machine_model"
                value={formData.machine_model || ""}
                onChange={handleInputChange}
              >
                {dependencies.machine_models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.machine_model_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="engineModel">
              <Form.Label>Модель двигателя</Form.Label>
              <Form.Select
                name="engine_model"
                value={formData.engine_model || ""}
                onChange={handleInputChange}
              >
                {dependencies.engine_models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.engine_model_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="engineFactoryNumber">
              <Form.Label>Зав. № двигателя</Form.Label>
              <Form.Control
                type="text"
                name="engine_factory_number"
                value={formData.engine_factory_number || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="transmissionModel">
              <Form.Label>Модель трансмиссии</Form.Label>
              <Form.Select
                name="transmission_model"
                value={formData.transmission_model || ""}
                onChange={handleInputChange}
              >
                {dependencies.transmission_models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.transmission_model_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="transmissionFactoryNumber">
              <Form.Label>Зав. № трансмиссии</Form.Label>
              <Form.Control
                type="text"
                name="transmission_factory_number"
                value={formData.transmission_factory_number || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="leadBridgeModel">
              <Form.Label>Модель ведущего моста</Form.Label>
              <Form.Select
                name="lead_bridge_model"
                value={formData.lead_bridge_model || ""}
                onChange={handleInputChange}
              >
                {dependencies.lead_bridge_models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.lead_bridge_model_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="leadBridgeFactoryNumber">
              <Form.Label>Зав. № ведущего моста</Form.Label>
              <Form.Control
                type="text"
                name="lead_bridge_factory_number"
                value={formData.lead_bridge_factory_number || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="controlledBridgeModel">
              <Form.Label>Модель управляемого моста</Form.Label>
              <Form.Select
                name="controlled_bridge_model"
                value={formData.controlled_bridge_model || ""}
                onChange={handleInputChange}
              >
                {dependencies.controlled_bridge_models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.controlled_bridge_model_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="controlledBridgeFactoryNumber">
              <Form.Label>Зав. № управляемого моста</Form.Label>
              <Form.Control
                type="text"
                name="controlled_bridge_factory_number"
                value={formData.controlled_bridge_factory_number || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="supplyContractNumberDate">
              <Form.Label>Договор поставки №, дата</Form.Label>
              <Form.Control
                type="text"
                name="supply_contract_number_date"
                value={formData.supply_contract_number_date || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="dateShipmentFromFactory">
              <Form.Label>Дата отгрузки с завода</Form.Label>
              <DatePicker
                selected={formData.date_shipment_from_factory}
                onChange={handleDateChange}
                className="form-control"
              />
            </Form.Group>
            <Form.Group controlId="consumer">
              <Form.Label>Грузополучатель</Form.Label>
              <Form.Control
                type="text"
                name="consumer"
                value={formData.consumer || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="deliveryAddress">
              <Form.Label>Адрес поставки</Form.Label>
              <Form.Control
                type="text"
                name="delivery_address"
                value={formData.delivery_address || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="configuration">
              <Form.Label>Комплектация</Form.Label>
              <Form.Control
                type="text"
                name="configuration"
                value={formData.configuration || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="client">
              <Form.Label>Клиент</Form.Label>
              <Form.Select
                name="client"
                value={formData.client || ""}
                onChange={handleInputChange}
              >
                {dependencies.clients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="serviceCompany">
              <Form.Label>Сервисная компания</Form.Label>
              <Form.Select
                name="service_company"
                value={formData.service_company || ""}
                onChange={handleInputChange}
              >
                {dependencies.service_companies?.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CurrentMachine;
