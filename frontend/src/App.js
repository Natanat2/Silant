import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Form } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";

function App() {
  const [factoryNumber, setFactoryNumber] = useState("");

  const handleSearch = () => {
    console.log("Поиск по заводскому номеру:", factoryNumber);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <div className="logo-container">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="contact-info">
            <span>+7-8352-20-12-09, telegram</span>
          </div>
          <div className="auth-button">
            <Button variant="primary">Авторизация</Button>
          </div>
        </div>

        <div className="header-title">
          <h2>Электронная сервисная книжка "Мой Силант"</h2>
        </div>
      </header>
      <body className="App-body">
        <div className="search-title">
          <span>
            Проверьте комплектацию и технические характеристики техники Силант
          </span>
        </div>
        <div className="search">
          <InputGroup className="search-form">
            <InputGroup.Text id="basic-addon1">
              Введите Заводской номер:
            </InputGroup.Text>
            <Form.Control
              type="text"
              value={factoryNumber}
              onChange={(e) => setFactoryNumber(e.target.value)}
              className="search-input"
            />
          </InputGroup>
          <Button
            variant="primary"
            className="search-button"
            onClick={handleSearch}
          >
            Поиск
          </Button>
        </div>
      </body>
      <footer className="App-footer">
        <div className="contact-info">
          <span>+7-8352-20-12-09, telegram</span>
        </div>
        <div className="auth-button">
          <Button variant="primary">Мой Силант 2022</Button>
        </div>
      </footer>
    </div>
  );
}

export default App;
