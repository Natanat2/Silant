import React from "react";
import { Table } from "react-bootstrap";

const TableWithMachineData = ({ machineData }) => {
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
          {
            label: "Зав. № машины",
            value: machineData.machine_factory_number,
          },
          {
            label: "Модель машины",
            value: machineData.machine_model.machine_model_name,
          },
          {
            label: "Зав. № двигателя",
            value: machineData.engine_factory_number,
          },
          {
            label: "Модель двигателя",
            value: machineData.engine_model.engine_model_name,
          },
          {
            label: "Зав. № трансмиссии",
            value: machineData.transmission_factory_number,
          },
          {
            label: "Модель трансмиссии",
            value: machineData.transmission_model.transmission_model_name,
          },
          {
            label: "Зав. № ведущего моста",
            value: machineData.lead_bridge_factory_number,
          },
          {
            label: "Модель ведущего моста",
            value: machineData.lead_bridge_model.lead_bridge_model_name,
          },
          {
            label: "Зав. № управляемого моста",
            value: machineData.controlled_bridge_factory_number,
          },
          {
            label: "Модель управляемого моста",
            value:
              machineData.controlled_bridge_model.controlled_bridge_model_name,
          },
          {
            label: "Дата отгрузки с завода",
            value: machineData.date_shipment_from_factory,
          },
          { label: "Потребитель", value: machineData.consumer },
          { label: "Клиент", value: machineData.client.user_full_name },
          {
            label: "Компания обслуживания",
            value: machineData.service_company.user_full_name,
          },
        ].map((row, index) => (
          <tr key={index}>
            <td>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableWithMachineData;
