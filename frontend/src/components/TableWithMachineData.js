import React from "react";
import { Table } from "react-bootstrap";

const TableWithMachineData = ({ machineData }) => {
  if (!machineData) {
    return <div>Данные отсутствуют</div>;
  }

  // Проверяем, что machine_model и другие свойства существуют
  const {
    machine_model = {},
    engine_model = {},
    transmission_model = {},
    lead_bridge_model = {},
    controlled_bridge_model = {},
    client = {},
    service_company = {},
  } = machineData;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Параметр</th>
          <th>Значение</th>
        </tr>
      </thead>
      <tbody>
        {[
          { label: "Зав. № машины", value: machineData.machine_factory_number },
          { label: "Модель машины", value: machine_model.machine_model_name },
          {
            label: "Зав. № двигателя",
            value: machineData.engine_factory_number,
          },
          { label: "Модель двигателя", value: engine_model.engine_model_name },
          {
            label: "Зав. № трансмиссии",
            value: machineData.transmission_factory_number,
          },
          {
            label: "Модель трансмиссии",
            value: transmission_model.transmission_model_name,
          },
          {
            label: "Зав. № ведущего моста",
            value: machineData.lead_bridge_factory_number,
          },
          {
            label: "Модель ведущего моста",
            value: lead_bridge_model.lead_bridge_model_name,
          },
          {
            label: "Зав. № управляемого моста",
            value: machineData.controlled_bridge_factory_number,
          },
          {
            label: "Модель управляемого моста",
            value: controlled_bridge_model.controlled_bridge_model_name,
          },
          {
            label: "Дата отгрузки с завода",
            value: machineData.date_shipment_from_factory,
          },
          { label: "Потребитель", value: machineData.consumer },
          { label: "Клиент", value: client.user_full_name },
          {
            label: "Компания обслуживания",
            value: service_company.user_full_name,
          },
          { label: "Адрес поставки", value: machineData.delivery_address },
          {
            label: "Номер договора поставки",
            value: machineData.supply_contract_number_date,
          },
          { label: "Комплектация", value: machineData.configuration },
        ].map((row, index) => (
          <tr key={index}>
            <td>{row.label}</td>
            <td>{row.value || "Не указано"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableWithMachineData;
