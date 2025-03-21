import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, ButtonGroup, Table, Spinner, Form } from "react-bootstrap";
import { useTable, useFilters, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";

const Panel = () => {
  const navigate = useNavigate();
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

  const handleMachineClick = useCallback(
    (row) => {
      const machineId = row.original.id;
      const machineIndex = `Машина-${row.index + 1}`; // Генерируем "Машина-1", "Машина-2"
      navigate(`/machine/${machineId}`, {
        state: { machineIndex }, // Передаем индекс машины в state
      });
    },
    [navigate]
  );

  const columns = useMemo(() => {
    const clickableColumn = {
      Header: "Машины",
      accessor: "machine_factory_number",
      id: "clickable_machine",
      Cell: ({ row }) => (
        <a
          href={`/machine/${row.original.id}`}
          onClick={(e) => {
            e.preventDefault();
            handleMachineClick(row, row.index); // Передаем индекс
          }}
        >
          {`Машина-${row.index + 1}`}
        </a>
      ),
    };

    if (activeTable === "table1") {
      return [
        clickableColumn,
        { Header: "Зав. № машины", accessor: "machine_factory_number" },
        {
          Header: "Модель машины",
          accessor: "machine_model.machine_model_name",
        },
        { Header: "Зав. № двигателя", accessor: "engine_factory_number" },
        {
          Header: "Модель двигателя",
          accessor: "engine_model.engine_model_name",
        },
        {
          Header: "Зав. № трансмиссии",
          accessor: "transmission_factory_number",
        },
        {
          Header: "Модель трансмиссии",
          accessor: "transmission_model.transmission_model_name",
        },
        {
          Header: "Зав. № ведущего моста",
          accessor: "lead_bridge_factory_number",
        },
        {
          Header: "Модель ведущего моста",
          accessor: "lead_bridge_model.lead_bridge_model_name",
        },
        {
          Header: "Зав. № управляемого моста",
          accessor: "controlled_bridge_factory_number",
        },
        {
          Header: "Модель управляемого моста",
          accessor: "controlled_bridge_model.controlled_bridge_model_name",
        },
        {
          Header: "Дата отгрузки с завода",
          accessor: "date_shipment_from_factory",
        },
        { Header: "Адрес доставки", accessor: "delivery_address" },
        {
          Header: "Номер договора поставки",
          accessor: "supply_contract_number_date",
        },
        { Header: "Комплектация", accessor: "configuration" },
        { Header: "Потребитель", accessor: "consumer" },
        { Header: "Клиент", accessor: "client.user_full_name" },
        {
          Header: "Компания обслуживания",
          accessor: "service_company.user_full_name",
        },
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
  }, [activeTable, handleMachineClick]);

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
            {headerGroups.map((headerGroup, index) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={`header-${index}`}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`header-${column.id}`}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""}
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Фильтр"
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
                <tr
                  {...row.getRowProps()}
                  key={`row-${row.index}-${row.original.id}`}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      key={`cell-${cell.column.id}-${row.original.id}`}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
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
