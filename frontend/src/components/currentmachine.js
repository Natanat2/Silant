import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Table } from "react-bootstrap";

const CurrentMachine = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [machineData, setMachineData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/service/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        const data = await response.json();
        setMachineData(data);
      } catch (error) {
        console.error("Ошибка:", error);
        setMachineData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachineData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!machineData) {
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
            <td>Модель машины</td>
            <td>{machineData.machine_model.machine_model_name}</td>
          </tr>
          <tr>
            <td>Зав. № двигателя</td>
            <td>{machineData.engine_factory_number}</td>
          </tr>
          {/* Добавьте другие параметры по аналогии */}
        </tbody>
      </Table>
    </div>
  );
};

export default CurrentMachine;
