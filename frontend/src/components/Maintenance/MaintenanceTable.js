import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import MaintenanceCreateModal from "./MaintenanceCreateModal";

const MaintenanceTable = ({ machineFactoryNumber, onEdit }) => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null);

  // Обернули fetchMaintenanceData в useCallback
  const fetchMaintenanceData = useCallback(async () => {
    if (!machineFactoryNumber) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/maintenance/filter-by-machine/`,
        {
          params: { machine_factory_number: machineFactoryNumber },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMaintenanceData(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке данных ТО:", err);
      setError("Не удалось загрузить данные ТО. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }, [machineFactoryNumber]);

  // useEffect использует fetchMaintenanceData
  useEffect(() => {
    fetchMaintenanceData();
  }, [fetchMaintenanceData]);

  // Обработчики для модального окна
  const handleCreate = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleSaveMaintenance = () => {
    setShowCreateModal(false);
    fetchMaintenanceData(); // Перезагрузка данных после сохранения
  };

  // Обработчики для удаления
  const handleOpenDeleteModal = (id) => {
    setSelectedMaintenanceId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedMaintenanceId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/api/maintenance/${selectedMaintenanceId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchMaintenanceData(); // Перезагрузить данные после удаления
    } catch (err) {
      console.error("Ошибка при удалении записи ТО:", err);
    } finally {
      handleCloseDeleteModal();
    }
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
        <Button variant="primary" onClick={handleCreate}>
          Создать ТО
        </Button>
      </div>

      {maintenanceData.length === 0 ? (
        <div className="text-center">Данных о ТО пока нет.</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Вид ТО</th>
              <th>Дата ТО</th>
              <th>Наработка (м/час)</th>
              <th>Номер заказа</th>
              <th>Дата заказа</th>
              <th>Организация</th>
              <th>Сервисная компания</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>
                  {maintenance.type_of_maintenance.type_of_maintenance_name}
                </td>
                <td>{maintenance.date_of_maintenance}</td>
                <td>{maintenance.operating_time}</td>
                <td>{maintenance.order_number}</td>
                <td>{maintenance.order_date}</td>
                <td>
                  {maintenance.organization_carried_maintenance
                    ?.name_organization || "Не указано"}
                </td>
                <td>
                  {maintenance.service_company_maintenance?.user?.first_name ||
                    "Не указано"}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(maintenance)}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenDeleteModal(maintenance.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальное окно создания ТО */}
      <MaintenanceCreateModal
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        onSave={handleSaveMaintenance}
        machineFactoryNumber={machineFactoryNumber}
      />

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить эту запись ТО? Действие необратимо.
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

export default MaintenanceTable;
