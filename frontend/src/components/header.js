import React, { useState } from "react";
import "../styles/header.css";
import logo from "./Logotype.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import Login from "./login";
import { useNavigate } from "react-router-dom";

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const closeLoginWindow = () => {
    setShowLogin(false);
  };

  return (
    <header className="App-header">
      <div className="header-top">
        <div className="logo-container">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="contact-info">
          <Button variant="light">+7-8352-20-12-09, telegram</Button>
        </div>
        <div className="auth-button">
          {isAuthenticated ? (
            <Button variant="danger" onClick={handleLogout}>
              Выйти
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setShowLogin(!showLogin)}>
              {showLogin ? "Закрыть" : "Авторизация"}
            </Button>
          )}
        </div>
      </div>

      <div className="header-title">
        <h2>Электронная сервисная книжка "Мой Силант"</h2>
      </div>

      {showLogin && (
        <Login
          setIsAuthenticated={setIsAuthenticated}
          closeLoginWindow={closeLoginWindow}
        />
      )}
    </header>
  );
};

export default Header;
