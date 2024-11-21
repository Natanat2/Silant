import React from "react";
import logo from "./Logotype.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import MainSearch from "./components/search";

import { Button } from "react-bootstrap";

function App() {
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

      <main className="App-body">
        <MainSearch />
      </main>

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
