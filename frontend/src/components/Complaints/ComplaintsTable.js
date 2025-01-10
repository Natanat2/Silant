import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const ComplaintsTable = ({ machineFactoryNumber }) => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaintsData = async () => {
      if (!machineFactoryNumber) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/complaints/filter-by-machine/`,
          {
            params: { machine_factory_number: machineFactoryNumber },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaintsData(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных рекламаций:", err);
        setError("Не удалось загрузить данные рекламаций. Попробуйте снова.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintsData();
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
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      {complaintsData.length === 0 ? (
        <div className="text-center">Данных о рекламациях пока нет.</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Зав. № машины</th>
              <th>Узел отказа</th>
              <th>Описание отказа</th>
              <th>Способ восстановления</th>
              <th>Используемые запчасти</th>
              <th>Дата отказа</th>
              <th>Дата восстановления</th>
              <th>Время простоя (дн.)</th>
              <th>Сервисная компания</th>
            </tr>
          </thead>
          <tbody>
            {complaintsData.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.machine.machine_factory_number}</td>
                <td>{complaint.failure_node.name_of_node}</td>
                <td>{complaint.description_of_refusal}</td>
                <td>{complaint.method_of_recovery.name_of_method}</td>
                <td>{complaint.spare_parts_used || "Не указано"}</td>
                <td>{complaint.date_of_refusal}</td>
                <td>{complaint.restoration_date}</td>
                <td>{complaint.downtime}</td>
                <td>{complaint.service_company_maintenance.user.first_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ComplaintsTable;
