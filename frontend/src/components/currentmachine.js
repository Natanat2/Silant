import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TableWithMachineData from "./TableWithMachineData";
import Buttons from "./Buttons";
import MachineModal from "./MachineModal";
import CreateMachineModal from "./CreateMachineModal";

const CurrentMachine = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [machineData, setMachineData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
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

      // Подтверждение удаления
      const confirmDelete = window.confirm(
        "Вы уверены, что хотите удалить эту машину?"
      );
      if (!confirmDelete) return;

      // DELETE-запрос
      await axios.delete(`http://127.0.0.1:8000/api/service/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Переход на главную страницу
      navigate("/panel");
    } catch (error) {
      console.error("Ошибка при удалении машины:", error);
      alert("Не удалось удалить машину. Попробуйте снова.");
    }
  };

  const isManager = userGroup && userGroup.includes("Manager");

  return (
    <div>
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
    </div>
  );
};

export default CurrentMachine;
