import React, { useState } from "react";
import "./search.css";
import { Form, InputGroup, Button, Table } from "react-bootstrap";
import axios from "axios";

const Search = () => {
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

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>
          Проверьте комплектацию и технические характеристики техники Силант
        </h2>
      </div>
      <div className="search-form-container">
        <InputGroup className="search-form">
          <InputGroup.Text>Введите Заводской номер:</InputGroup.Text>
          <Form.Control
            type="text"
            value={factoryNumber}
            onChange={(e) => setFactoryNumber(e.target.value)}
            className="search-input"
          />
        </InputGroup>
        <Button
          variant="primary"
          onClick={handleSearch}
          className="search-button"
        >
          Поиск
        </Button>
      </div>
      <div className="search-result">
        <h3>Результат поиска:</h3>
      </div>
      <div className="table-result">
        {searchResults.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Заводской номер</th>
                <th>Модель машины</th>
                <th>Модель двигателя</th>
                <th>Заводской номер двигателя</th>
                <th>Модель трансмиссии</th>
                <th>Заводской номер трансмиссии</th>
                <th>Модель ведущего моста</th>
                <th>Заводской номер ведущего моста</th>
                <th>Модель управляемого моста</th>
                <th>Заводской номер управляемого моста</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((item, index) => (
                <tr key={index}>
                  <td>{item.machine_factory_number}</td>
                  <td>{item.machine_model.machine_model_name}</td>
                  <td>{item.engine_model.engine_model_name}</td>
                  <td>{item.engine_factory_number}</td>
                  <td>{item.transmission_model.transmission_model_name}</td>
                  <td>{item.transmission_factory_number}</td>
                  <td>{item.lead_bridge_model.lead_bridge_model_name}</td>
                  <td>{item.lead_bridge_factory_number}</td>
                  <td>
                    {item.controlled_bridge_model.controlled_bridge_model_name}
                  </td>
                  <td>{item.controlled_bridge_factory_number}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <span>Нет данных для отображения</span>
        )}
      </div>
    </div>
  );
};

export default Search;
