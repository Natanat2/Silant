import React from "react";
import { Table } from "react-bootstrap";

const resolveDependency = (id, list, key) => {
  const item = list.find((el) => el.id === id);
  return item ? item[key] : "Не указано";
};

const TableWithMachineData = ({ machineData, dependencies }) => {
  const {
    machine_models,
    engine_models,
    transmission_models,
    lead_bridge_models,
    controlled_bridge_models,
    clients,
    service_companies,
  } = dependencies;

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
          {
            label: "Модель машины",
            value: resolveDependency(
              machineData.machine_model,
              machine_models,
              "machine_model_name"
            ),
          },
          {
            label: "Зав. № двигателя",
            value: machineData.engine_factory_number,
          },
          {
            label: "Модель двигателя",
            value: resolveDependency(
              machineData.engine_model,
              engine_models,
              "engine_model_name"
            ),
          },
          {
            label: "Зав. № трансмиссии",
            value: machineData.transmission_factory_number,
          },
          {
            label: "Модель трансмиссии",
            value: resolveDependency(
              machineData.transmission_model,
              transmission_models,
              "transmission_model_name"
            ),
          },
          {
            label: "Зав. № ведущего моста",
            value: machineData.lead_bridge_factory_number,
          },
          {
            label: "Модель ведущего моста",
            value: resolveDependency(
              machineData.lead_bridge_model,
              lead_bridge_models,
              "lead_bridge_model_name"
            ),
          },
          {
            label: "Зав. № управляемого моста",
            value: machineData.controlled_bridge_factory_number,
          },
          {
            label: "Модель управляемого моста",
            value: resolveDependency(
              machineData.controlled_bridge_model,
              controlled_bridge_models,
              "controlled_bridge_model_name"
            ),
          },
          {
            label: "Дата отгрузки с завода",
            value: machineData.date_shipment_from_factory,
          },
          {
            label: "Потребитель",
            value: machineData.consumer,
          },
          {
            label: "Клиент",
            value: resolveDependency(
              machineData.client,
              clients,
              "user_full_name"
            ),
          },
          {
            label: "Компания обслуживания",
            value: resolveDependency(
              machineData.service_company,
              service_companies,
              "user_full_name"
            ),
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
