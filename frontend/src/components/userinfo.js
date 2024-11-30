import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentUser = () => {
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/service/current_user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setName(response.data.name);
      } catch (err) {
        setError("Не удалось получить данные пользователя");
      }
    };

    fetchCurrentUser();
  }, []);

  if (!name && !error) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h3>
        <strong>Имя пользователя:</strong> {name}
      </h3>
    </div>
  );
};

export default CurrentUser;
