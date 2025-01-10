import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import ComplaintsCreateModal from "./ComplaintsCreateModal";
import ComplaintsEditModal from "./ComplaintsEditModal";

const ComplaintsTable = ({ machineFactoryNumber }) => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaintsData = useCallback(async () => {
    if (!machineFactoryNumber) {
      setError("Не указан заводской номер машины");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Отсутствует токен авторизации");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/complaints/filter-by-machine/`,
        {
          params: { machine_factory_number: machineFactoryNumber },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComplaintsData(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке данных жалоб:", err);
      setError("Не удалось загрузить данные жалоб. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }, [machineFactoryNumber]);

  useEffect(() => {
    fetchComplaintsData();
  }, [fetchComplaintsData]);

  const handleCreate = () => setShowCreateModal(true);
  const handleEdit = (complaint) => {
    setSelectedComplaint(complaint);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту рекламацию?"))
      return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Отсутствует токен авторизации");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/complaints/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchComplaintsData();
    } catch (err) {
      console.error("Ошибка при удалении жалобы:", err);
      setError("Не удалось удалить жалобу. Попробуйте снова.");
    }
  };

  return (
    <div>
      <div className="mb-3">
        <Button variant="primary" onClick={handleCreate}>
          Создать рекламацию
        </Button>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Загрузка данных...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && complaintsData.length === 0 && (
        <div className="text-center">Данных о жалобах пока нет.</div>
      )}

      {!loading && complaintsData.length > 0 && (
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
              <th>Время простоя</th>
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
                <td>{complaint.failure_node.name_of_node}</td>
                <td>{complaint.description_of_refusal}</td>
                <td>{complaint.method_of_recovery.name_of_method}</td>
                <td>{complaint.spare_parts_used || "Не указано"}</td>
                <td>{complaint.restoration_date}</td>
                <td>{complaint.downtime}</td>
                <td>{complaint.service_company_maintenance.user.first_name}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(complaint)}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(complaint.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальное окно создания жалобы */}
      <ComplaintsCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={fetchComplaintsData}
        machineId={complaintsData[0]?.machine.id || null}
      />

      {/* Модальное окно редактирования жалобы */}
      {selectedComplaint && (
        <ComplaintsEditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          complaintData={selectedComplaint}
          onSave={fetchComplaintsData}
        />
      )}
    </div>
  );
};

export default ComplaintsTable;
