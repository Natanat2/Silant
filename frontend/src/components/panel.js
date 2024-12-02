import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, ButtonGroup, Table, Spinner, Form } from "react-bootstrap";
import { useTable, useFilters, useSortBy } from "react-table";

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
          throw new Error("Ошибка при загрузке данных");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
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

  const columns = useMemo(() => {
    if (activeTable === "table1") {
      return [
        { Header: "Зав. № машины", accessor: "machine_factory_number" },
        {
          Header: "Модель машины",
          accessor: "machine_model.machine_model_name",
        },
        {
          Header: "Модель двигателя",
          accessor: "engine_model.engine_model_name",
        },
        {
          Header: "Модель трансмиссии",
          accessor: "transmission_model.transmission_model_name",
        },
        {
          Header: "Модель ведущего моста",
          accessor: "lead_bridge_model.lead_bridge_model_name",
        },
        {
          Header: "Модель управляемого моста",
          accessor: "controlled_bridge_model.controlled_bridge_model_name",
        },
        { Header: "Клиент", accessor: "client.user_full_name" },
        {
          Header: "Компания обслуживания",
          accessor: "service_company.user_full_name",
        },
        { Header: "Зав. № двигателя", accessor: "engine_factory_number" },
        {
          Header: "Зав. № трансмиссии",
          accessor: "transmission_factory_number",
        },
        {
          Header: "Зав. № ведущего моста",
          accessor: "lead_bridge_factory_number",
        },
        {
          Header: "Зав. № управляемого моста",
          accessor: "controlled_bridge_factory_number",
        },
        { Header: "Контракт", accessor: "supply_contract_number_date" },
        { Header: "Дата отгрузки", accessor: "date_shipment_from_factory" },
        { Header: "Потребитель", accessor: "consumer" },
        { Header: "Адрес доставки", accessor: "delivery_address" },
        { Header: "Конфигурация", accessor: "configuration" },
      ];
    } else if (activeTable === "table2") {
      return [
        { Header: "Зав. № машины", accessor: "machine.machine_factory_number" },
        {
          Header: "Вид ТО",
          accessor: "type_of_maintenance.type_of_maintenance_name",
        },
        { Header: "Дата проведения ТО", accessor: "date_of_maintenance" },
        { Header: "Наработка, м/час", accessor: "operating_time" },
        { Header: "№ заказ-наряда", accessor: "order_number" },
        { Header: "Дата заказ-наряда", accessor: "order_date" },
        {
          Header: "Организация, проводившая ТО",
          accessor: "organization_carried_maintenance.name_organization",
        },
      ];
    } else if (activeTable === "table3") {
      return [
        { Header: "Зав. № машины", accessor: "machine.machine_factory_number" },
        { Header: "Дата отказа", accessor: "date_of_refusal" },
        { Header: "Наработка", accessor: "operating_time_refusal" },
        { Header: "Узел отказа", accessor: "failure_node.name_of_node" },
        { Header: "Описание отказа", accessor: "description_of_refusal" },
        { Header: "Способ", accessor: "method_of_recovery.name_of_method" },
        { Header: "Используемые", accessor: "spare_parts_used" },
        { Header: "Дата восстановления", accessor: "restoration_date" },
        { Header: "Время", accessor: "downtime" },
      ];
    }
    return [];
  }, [activeTable]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  const handleFilterChange = (e, columnId) => {
    setFilter(columnId, e.target.value || undefined);
  };

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

    return (
      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""}
                    </span>
                    {}
                    <Form.Control
                      type="text"
                      placeholder="Фильтровать"
                      onChange={(e) => handleFilterChange(e, column.id)}
                      style={{ marginTop: "5px" }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center mb-4">
        <ButtonGroup>
          <Button
            variant="light"
            onClick={() => setActiveTable("table1")}
            className="me-2"
          >
            Машины
          </Button>
          <Button
            variant="light"
            onClick={() => setActiveTable("table2")}
            className="me-2"
          >
            ТО
          </Button>
          <Button
            variant="light"
            onClick={() => setActiveTable("table3")}
            className="me-2"
          >
            Отказы
          </Button>
        </ButtonGroup>
      </div>
      {renderTable()}
    </div>
  );
};

export default Panel;
