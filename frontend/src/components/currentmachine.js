import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TableWithMachineData from "./TableWithMachineData";
import Buttons from "./Buttons";
import MachineModal from "./MachineModal";
import CreateMachineModal from "./CreateMachineModal";

const CurrentMachine = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [machineData, setMachineData] = useState(null);
  const [dependencies, setDependencies] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const { id } = useParams();

  const fetchUserGroup = async (token) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/service/current_user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserGroup(response.data.groups);
    } catch (error) {
      console.error("Ошибка при загрузке информации о пользователе", error);
    }
  };

  const fetchDependencies = async (token) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/service/machine-dependencies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDependencies(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке зависимостей", error);
    }
  };

  const fetchMachineData = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Отсутствует токен");
        return;
      }
      await fetchUserGroup(token);
      await fetchDependencies(token);
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
    fetchMachineData();
  }, [fetchMachineData]);

  if (!machineData || !dependencies) {
    return <div>Загрузка...</div>;
  }

  const isManager = userGroup && userGroup.includes("Manager");

  const handleEdit = () => setShowModal(true);
  const handleDelete = () => {
    console.log("Машина удалена");
  };
  const handleCreate = () => setShowCreateModal(true);

  return (
    <div>
      <Buttons
        isManager={isManager}
        onCreate={handleCreate}
        onEdit={handleEdit}
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
        setFormData={setMachineData}
      />
      <TableWithMachineData
        machineData={machineData}
        dependencies={dependencies}
      />
    </div>
  );
};

export default CurrentMachine;
