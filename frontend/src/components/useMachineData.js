import { useState, useEffect } from "react";
import axios from "axios";

const useMachineData = (userGroup) => {
  const [machines, setMachines] = useState([]);
  const [dependencies, setDependencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем токен из localStorage (или другого места)
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token not found");
        }

        // Заголовки с токеном для авторизованных запросов
        const headers = {
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
        };

        // Получаем данные о машинах
        const machinesResponse = await axios.get(
          "http://127.0.0.1:8000/api/service/public_machines",
          { headers }
        );
        setMachines(machinesResponse.data);

        // Получаем зависимости для машин
        const dependenciesResponse = await axios.get(
          "http://127.0.0.1:8000/api/service/machine-dependencies",
          { headers }
        );
        setDependencies(dependenciesResponse.data);
      } catch (error) {
        console.error(
          "Ошибка при получении данных машин или зависимостей:",
          error
        );
      }
    };

    fetchData();
  }, [userGroup]);

  return { machines, dependencies };
};

export default useMachineData;
