import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import TableWithMachineData from "./TableWithMachineData";
import Buttons from "./Buttons";
import MachineModal from "./MachineModal";
import CreateMachineModal from "./CreateMachineModal";
import MaintenanceTable from "./Maintenance/MaintenanceTable";
import MaintenanceEditModal from "./Maintenance/MaintenanceEditModal";
import ComplaintsTable from "./Complaints/ComplaintsTable";
import ComplaintsEditModal from "./Complaints/ComplaintsEditModal"; // Добавляем компонент редактирования рекламации

const CurrentMachine = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditMaintenanceModal, setShowEditMaintenanceModal] =
    useState(false);
  const [showEditComplaintModal, setShowEditComplaintModal] = useState(false); // Новое состояние
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // Новое состояние
  const [machineData, setMachineData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
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

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowEditMaintenanceModal(true);
  };

  const handleEditComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowEditComplaintModal(true);
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
        Машина{machineData ? ` ${id}` : "Неизвестно"} - Заводской номер:{" "}
        {machineData?.machine_factory_number || "Неизвестно"}
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
          <h2>Информация о проведенных ТО вашей техники</h2>
          <MaintenanceTable
            machineFactoryNumber={machineData?.machine_factory_number}
            onEdit={handleEditMaintenance}
          />
        </Tab>

        <Tab eventKey="complaints" title="Рекламации">
          <h2>Информация о рекламациях вашей техники</h2>
          <ComplaintsTable
            machineFactoryNumber={machineData?.machine_factory_number}
            userGroup={userGroup}
            onEdit={handleEditComplaint}
          />
        </Tab>
      </Tabs>

      {/* Модальное окно для редактирования ТО */}
      {selectedMaintenance && (
        <MaintenanceEditModal
          show={showEditMaintenanceModal}
          onClose={() => setShowEditMaintenanceModal(false)}
          maintenanceData={selectedMaintenance}
          onSave={fetchMachineData}
        />
      )}

      {/* Модальное окно для редактирования рекламаций */}
      {selectedComplaint && (
        <ComplaintsEditModal
          show={showEditComplaintModal}
          onClose={() => setShowEditComplaintModal(false)}
          complaintData={selectedComplaint}
          onSave={fetchMachineData}
        />
      )}
    </div>
  );
};

export default CurrentMachine;
