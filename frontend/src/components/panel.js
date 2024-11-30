import React, { useState } from "react";
import "../styles/panel.css";
import { Button, Table } from "react-bootstrap";

import axios from "axios";

const Panel = () => {
  const [factoryNumber, setFactoryNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/service/", {
        params: { machine_factory_number: factoryNumber },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Ошибка при выполнении поиска:", error);
    }
  };

  return <div>panel</div>;
};

export default Panel;
