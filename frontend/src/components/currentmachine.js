import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TableWithMachineData from "./TableWithMachineData";
import Buttons from "./Buttons";
import MachineModal from "./MachineModal";
import CreateMachineModal from "./CreateMachineModal"; // Импортируем новый компонент

const CurrentMachine = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // Новый стейт для отображения модального окна для создания
  const [machineData, setMachineData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
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
  }, [id]); // Добавляем id в зависимости, чтобы функция вызывалась при изменении id

  useEffect(() => {
    fetchUserGroup();
    fetchMachineData();
  }, [id, fetchMachineData]); // Добавляем fetchMachineData в зависимости

  if (!machineData) {
    return <div>Загрузка...</div>;
  }

  const isManager = userGroup && userGroup.includes("Manager");

  const handleEdit = () => setShowModal(true);
  const handleDelete = () => {
    // Логика для удаления машины
    console.log("Машина удалена");
  };

  const handleCreate = () => setShowCreateModal(true); // Открываем модальное окно для создания новой машины

  return (
    <div>
      {/* Кнопки отображаются в нужном порядке */}
      <Buttons
        isManager={isManager}
        onCreate={handleCreate} // Обработчик для кнопки "Создать"
        onEdit={handleEdit} // Обработчик для кнопки "Редактировать"
        onDelete={handleDelete} // Обработчик для кнопки "Удалить"
      />
      {/* Модальные окна для создания/редактирования */}
      <CreateMachineModal
        showModal={showCreateModal}
        handleClose={() => setShowCreateModal(false)} // Закрываем модальное окно для создания
        formData={machineData} // Передаем данные для формы
        setFormData={setMachineData} // Передаем setMachineData для изменения данных машины
      />
      <MachineModal
        showModal={showModal}
        handleClose={() => setShowModal(false)} // Закрываем модальное окно для редактирования
        formData={machineData} // Передаем данные для редактирования
        setFormData={setMachineData} // Используем setMachineData для изменения данных машины
      />

      {/* Отображаем таблицу с данными машины */}
      <TableWithMachineData machineData={machineData} />
    </div>
  );
};

export default CurrentMachine;
