import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import MaintenanceCreateModal from "./MaintenanceCreateModal";

const MaintenanceTable = ({ machineFactoryNumber, onEdit }) => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Функция для загрузки данных ТО
  const fetchMaintenanceData = async () => {
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
  };

  // Загрузка данных при изменении machineFactoryNumber
  useEffect(() => {
    fetchMaintenanceData();
  }, [machineFactoryNumber]);

  // Обработчики для модального окна
  const handleCreate = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleSaveMaintenance = () => {
    setShowCreateModal(false);
    fetchMaintenanceData(); // Перезагрузка данных после сохранения
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
              <th>Действия</th>
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
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(maintenance)}
                  >
                    Редактировать
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
    </div>
  );
};

export default MaintenanceTable;
