import React from "react";
import "../styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="App-footer">
      <div className="contact-info">
        <Button variant="light">+7-8352-20-12-09, telegram</Button>
      </div>
      <div className="auth-button">
        <Button variant="danger">Мой Силант 2022</Button>
      </div>
    </footer>
  );
};

export default Footer;
