import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Toast } from "react-bootstrap";
import axios from "axios";

const ComplaintsEditModal = ({ show, onClose, complaintData, onSave }) => {
  const [localFormData, setLocalFormData] = useState({
    failure_node: "",
    method_of_recovery: "",
    date_of_refusal: "",
    operating_time_refusal: "",
    description_of_refusal: "",
    spare_parts_used: "",
    restoration_date: "",
    service_company_maintenance: "",
  });
  const [dependencies, setDependencies] = useState({
    failureNodes: [],
    recoveryMethods: [],
    serviceCompanies: [],
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Загрузка зависимостей для формы
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/complaints/types_of_complaints/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDependencies({
          failureNodes: response.data.failure_nodes || [],
          recoveryMethods: response.data.methods_of_recovery || [],
          serviceCompanies: response.data.service_companies || [],
        });
      } catch (err) {
        console.error("Ошибка при загрузке зависимостей:", err);
      }
    };

    fetchDependencies();
  }, []);

  // Установка данных для редактирования
  useEffect(() => {
    if (complaintData) {
      setLocalFormData({
        failure_node: complaintData.failure_node.id,
        method_of_recovery: complaintData.method_of_recovery.id,
        date_of_refusal: complaintData.date_of_refusal,
        operating_time_refusal: complaintData.operating_time_refusal,
        description_of_refusal: complaintData.description_of_refusal,
        spare_parts_used: complaintData.spare_parts_used || "",
        restoration_date: complaintData.restoration_date,
        service_company_maintenance:
          complaintData.service_company_maintenance.id,
      });
    }
  }, [complaintData]);

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
        return;
      }

      const requestData = {
        ...localFormData,
        machine: complaintData.machine.id,
        service_company_maintenance: parseInt(
          localFormData.service_company_maintenance,
          10
        ),
      };

      await axios.put(
        `http://127.0.0.1:8000/api/complaints/${complaintData.id}/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowSuccessToast(true);
      onSave();
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Ошибка при редактировании жалобы:", error);
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
        <Toast.Body>Жалоба успешно обновлена!</Toast.Body>
      </Toast>

      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать рекламацию</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Узел отказа</Form.Label>
                  <Form.Select
                    name="failure_node"
                    value={localFormData.failure_node}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите узел отказа...</option>
                    {dependencies.failureNodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name_of_node}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Способ восстановления</Form.Label>
                  <Form.Select
                    name="method_of_recovery"
                    value={localFormData.method_of_recovery}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите способ восстановления...</option>
                    {dependencies.recoveryMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name_of_method}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Дата отказа</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_refusal"
                    value={localFormData.date_of_refusal}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Наработка, м/час</Form.Label>
                  <Form.Control
                    type="number"
                    name="operating_time_refusal"
                    value={localFormData.operating_time_refusal}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Описание отказа</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description_of_refusal"
                    value={localFormData.description_of_refusal}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Используемые запчасти</Form.Label>
                  <Form.Control
                    type="text"
                    name="spare_parts_used"
                    value={localFormData.spare_parts_used}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Дата восстановления</Form.Label>
                  <Form.Control
                    type="date"
                    name="restoration_date"
                    value={localFormData.restoration_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Сервисная компания</Form.Label>
                  <Form.Select
                    name="service_company_maintenance"
                    value={localFormData.service_company_maintenance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите сервисную компанию...</option>
                    {dependencies.serviceCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.user.first_name}
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

export default ComplaintsEditModal;
