import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import MachineModal from "./MachineModal";
import axios from "axios";
import { useParams } from "react-router-dom";

const CurrentMachine = () => {
  const [showModal, setShowModal] = useState(false);
  const [machineData, setMachineData] = useState(null); // Данные машины
  const { id } = useParams(); // Получаем ID машины из URL

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Получаем токен из localStorage
        if (!token) {
          console.error("Отсутствует токен");
          return;
        }
        const response = await axios.get(
          `http://127.0.0.1:8000/api/service/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMachineData(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных о машине", error);
      }
    };

    fetchMachineData();
  }, [id]); // Запрашиваем данные при изменении ID

  if (!machineData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Редактировать машину</Button>
      <MachineModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        formData={machineData} // Передаем данные в модальное окно
        setFormData={setMachineData}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Параметр</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              label: "Зав. № машины",
              value: machineData.machine_factory_number,
            },
            {
              label: "Модель машины",
              value: machineData.machine_model.machine_model_name,
            },

            {
              label: "Зав. № двигателя",
              value: machineData.engine_factory_number,
            },
            {
              label: "Модель двигателя",
              value: machineData.engine_model.engine_model_name,
            },

            {
              label: "Зав. № трансмиссии",
              value: machineData.transmission_factory_number,
            },
            {
              label: "Модель трансмиссии",
              value: machineData.transmission_model.transmission_model_name,
            },

            {
              label: "Зав. № ведущего моста",
              value: machineData.lead_bridge_factory_number,
            },
            {
              label: "Модель ведущего моста",
              value: machineData.lead_bridge_model.lead_bridge_model_name,
            },

            {
              label: "Зав. № управляемого моста",
              value: machineData.controlled_bridge_factory_number,
            },
            {
              label: "Модель управляемого моста",
              value:
                machineData.controlled_bridge_model
                  .controlled_bridge_model_name,
            },

            {
              label: "Дата отгрузки с завода",
              value: machineData.date_shipment_from_factory,
            },
            { label: "Потребитель", value: machineData.consumer },
            { label: "Клиент", value: machineData.client.user_full_name },
            {
              label: "Компания обслуживания",
              value: machineData.service_company.user_full_name,
            },
          ].map((row, index) => (
            <tr key={index}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CurrentMachine;
