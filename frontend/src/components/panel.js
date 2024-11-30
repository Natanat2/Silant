import React from "react";
import "../styles/panel.css";
import CurrentUser from "./userinfo";

const Panel = () => {
  return (
    <div className="userinfo">
      <CurrentUser />
      <h4>
        Информация о комплектации и технических характеристиках Вашей техники
      </h4>
    </div>
  );
};

export default Panel;
