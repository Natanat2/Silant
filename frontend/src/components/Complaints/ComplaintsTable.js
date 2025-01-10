import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const ComplaintsTable = ({ machineFactoryNumber, onEdit }) => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const fetchComplaintsData = useCallback(async () => {
    if (!machineFactoryNumber) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/complaints/filter-by-machine/`,
        {
          params: { machine_factory_number: machineFactoryNumber },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComplaintsData(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке данных рекламаций:", err);
      setError("Не удалось загрузить данные рекламаций.");
    } finally {
      setLoading(false);
    }
  }, [machineFactoryNumber]);

  useEffect(() => {
    fetchComplaintsData();
  }, [fetchComplaintsData]);

  const handleOpenDeleteModal = (id) => {
    setSelectedComplaintId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedComplaintId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/api/complaints/${selectedComplaintId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComplaintsData(); // Обновляем данные после удаления
    } catch (err) {
      console.error("Ошибка при удалении записи рекламации:", err);
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleCreateComplaint = () => {
    // Логика открытия модального окна создания рекламации
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <Button variant="primary" onClick={handleCreateComplaint}>
          Создать рекламацию
        </Button>
      </div>

      {complaintsData.length === 0 ? (
        <div className="text-center">Данных о рекламациях пока нет.</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дата отказа</th>
              <th>Наработка, м/час</th>
              <th>Узел отказа</th>
              <th>Описание отказа</th>
              <th>Способ восстановления</th>
              <th>Используемые запчасти</th>
              <th>Дата восстановления</th>
              <th>Сервисная компания</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {complaintsData.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.date_of_refusal}</td>
                <td>{complaint.operating_time_refusal}</td>
                <td>{complaint.failure_node?.name_of_node || "Не указано"}</td>
                <td>{complaint.description_of_refusal}</td>
                <td>
                  {complaint.method_of_recovery?.name_of_method || "Не указано"}
                </td>
                <td>{complaint.spare_parts_used || "Не указано"}</td>
                <td>{complaint.restoration_date}</td>
                <td>
                  {complaint.service_company_maintenance?.user?.first_name ||
                    "Не указано"}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(complaint)}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenDeleteModal(complaint.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить эту запись рекламации? Действие
          необратимо.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComplaintsTable;
