import React from "react";
import "../styles/panel.css";
import CurrentUser from "./userinfo";

const Panel = () => {
  return (
    <div className="userinfo">
      <CurrentUser />
      <h3>
        Информация о комплектации и технических характеристиках Вашей техники
      </h3>
    </div>
  );
};

export default Panel;
