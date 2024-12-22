import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const MaintenanceTable = ({ machineFactoryNumber, onEdit }) => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchMaintenanceData();
  }, [machineFactoryNumber]);

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

  if (maintenanceData.length === 0) {
    return <div className="text-center">Данных о ТО пока нет.</div>;
  }

  return (
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
            <td>{maintenance.type_of_maintenance.type_of_maintenance_name}</td>
            <td>{maintenance.date_of_maintenance}</td>
            <td>{maintenance.operating_time}</td>
            <td>{maintenance.order_number}</td>
            <td>{maintenance.order_date}</td>
            <td>
              {maintenance.organization_carried_maintenance.name_organization}
            </td>
            <td>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(maintenance)} // Вызываем переданную функцию
              >
                Редактировать
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MaintenanceTable;
