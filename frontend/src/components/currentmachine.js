import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import TableWithMachineData from "./TableWithMachineData";
import Buttons from "./Buttons";
import MachineModal from "./MachineModal";
import CreateMachineModal from "./CreateMachineModal";
import MaintenanceTable from "./MaintenanceTable"; // Импорт нового компонента

const CurrentMachine = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [machineData, setMachineData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // Текущая активная вкладка
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchUserGroup = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Отсутствует токен");
        return;
      }
      const userResponse = await axios.get(
        "http://127.0.0.1:8000/api/service/current_user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const group = userResponse.data.groups;
      setUserGroup(group);
    } catch (error) {
      console.error("Ошибка при получении информации о пользователе", error);
    }
  };

  const fetchMachineData = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
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
  }, [id]);

  useEffect(() => {
    fetchUserGroup();
    fetchMachineData();
  }, [id, fetchMachineData]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Отсутствует токен");
        return;
      }

      const confirmDelete = window.confirm(
        "Вы уверены, что хотите удалить эту машину?"
      );
      if (!confirmDelete) return;

      await axios.delete(`http://127.0.0.1:8000/api/service/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/panel");
    } catch (error) {
      console.error("Ошибка при удалении машины:", error);
      alert("Не удалось удалить машину. Попробуйте снова.");
    }
  };

  const isManager = userGroup && userGroup.includes("Manager");

  return (
    <div className="current-machine">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/panel")}>
          Панель
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Детали машины</Breadcrumb.Item>
      </Breadcrumb>

      <h3>
        Машина {machineData?.machine_model?.machine_model_name || "Неизвестно"}{" "}
        - Заводской номер: {machineData?.machine_factory_number || "Неизвестно"}
      </h3>

      {/* Вкладки */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="info" title="Общая информация">
          <h2>Общая информация</h2>
          <Buttons
            isManager={isManager}
            onCreate={() => setShowCreateModal(true)}
            onEdit={() => setShowModal(true)}
            onDelete={handleDelete}
          />

          <CreateMachineModal
            showModal={showCreateModal}
            handleClose={() => setShowCreateModal(false)}
            formData={machineData}
            setFormData={setMachineData}
          />

          <MachineModal
            showModal={showModal}
            handleClose={() => setShowModal(false)}
            formData={machineData}
            onMachineUpdated={setMachineData}
          />

          {machineData && <TableWithMachineData machineData={machineData} />}
        </Tab>

        <Tab eventKey="maintenance" title="ТО">
          <h2>Информаци о проведенных ТО вашей техники</h2>
          <MaintenanceTable
            machineFactoryNumber={machineData?.machine_factory_number}
          />
        </Tab>

        <Tab eventKey="complaints" title="Рекламации">
          <h2>Информация о Рекламациях вашей техники</h2>
          <p>Раздел для отображения данных по рекламациям.</p>
        </Tab>
      </Tabs>
    </div>
  );
};

export default CurrentMachine;
