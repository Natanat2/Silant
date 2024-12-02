import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, ButtonGroup, Table, Spinner } from "react-bootstrap";

const Panel = () => {
  const [activeTable, setActiveTable] = useState("table1");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrls = useMemo(
    () => ({
      table1: "http://127.0.0.1:8000/api/service/user_machines",
      table2: "http://127.0.0.1:8000/api/maintenance/",
      table3: "http://127.0.0.1:8000/api/complaints/",
    }),
    []
  );

  const fetchData = useCallback(
    async (tableKey) => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrls[tableKey], {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrls]
  );

  useEffect(() => {
    fetchData(activeTable);
  }, [activeTable, fetchData]);

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (!data.length) {
      return <div className="text-center">Нет данных для отображения</div>;
    }

    if (activeTable === "table1") {
      const columns = [
        "Зав. № машины",
        "Модель машины",
        "Модель двигателя",
        "Модель трансмиссии",
        "Модель ведущего моста",
        "Модель управляемого моста",
        "Клиент",
        "Компания обслуживания",
        "Зав. № двигателя",
        "Зав. № трансмиссии",
        "Зав. № ведущего моста",
        "Зав. № управляемого моста",
        "Контракт",
        "Дата отгрузки",
        "Потребитель",
        "Адрес доставки",
        "Конфигурация",
      ];

      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.machine_factory_number}</td>
                <td>{row.machine_model?.machine_model_name}</td>
                <td>{row.engine_model?.engine_model_name}</td>
                <td>{row.transmission_model?.transmission_model_name}</td>
                <td>{row.lead_bridge_model?.lead_bridge_model_name}</td>
                <td>
                  {row.controlled_bridge_model?.controlled_bridge_model_name}
                </td>
                <td>{row.client?.user_full_name}</td>
                <td>{row.service_company?.user_full_name}</td>
                <td>{row.engine_factory_number}</td>
                <td>{row.transmission_factory_number}</td>
                <td>{row.lead_bridge_factory_number}</td>
                <td>{row.controlled_bridge_factory_number}</td>
                <td>{row.supply_contract_number_date}</td>
                <td>{row.date_shipment_from_factory}</td>
                <td>{row.consumer}</td>
                <td>{row.delivery_address}</td>
                <td>{row.configuration}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    if (activeTable === "table2") {
      const columns = [
        "Зав. № машины",
        "Вид ТО",
        "Дата проведения ТО",
        "Наработка, м/час",
        "№ заказ-наряда",
        "Дата заказ-наряда",
        "Организация, проводившая ТО",
      ];

      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.machine?.machine_factory_number}</td>
                <td>{row.type_of_maintenance?.type_of_maintenance_name}</td>
                <td>{row.date_of_maintenance}</td>
                <td>{row.operating_time}</td>
                <td>{row.order_number}</td>
                <td>{row.order_date}</td>
                <td>
                  {row.organization_carried_maintenance?.name_organization}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    if (activeTable === "table3") {
      const columns = [
        "Зав. № машины",
        "Дата отказа",
        "Наработка",
        "Узел отказа",
        "Описание отказа",
        "Способ",
        "Используемые",
        "Дата восстановления",
        "Время",
      ];

      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.machine?.machine_factory_number}</td>
                <td>{row.date_of_refusal}</td>
                <td>{row.operating_time_refusal}</td>
                <td>{row.failure_node?.name_of_node}</td>
                <td>{row.description_of_refusal}</td>
                <td>{row.method_of_recovery?.name_of_method}</td>
                <td>{row.spare_parts_used}</td>
                <td>{row.restoration_date}</td>
                <td>{row.downtime}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    return null;
  };

  return (
    <div className="container mt-4">
      <ButtonGroup>
        <Button variant="primary" onClick={() => setActiveTable("table1")}>
          Общая информация
        </Button>
        <Button variant="secondary" onClick={() => setActiveTable("table2")}>
          ТО
        </Button>
        <Button variant="success" onClick={() => setActiveTable("table3")}>
          Рекламации
        </Button>
      </ButtonGroup>
      <div className="mt-4">{renderTable()}</div>
    </div>
  );
};

export default Panel;
