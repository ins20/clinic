import { Table } from "@mantine/core";
import { Patient } from "../types";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useNavigate } from "react-router-dom";

const PatientsTable = ({ data }: { data: Patient[] }) => {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: data?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });
  return (
    <div
      ref={parentRef}
      style={{
        overflow: "auto", //our scrollable table container
        position: "relative", //needed for sticky header
        height: "600px", //should be a fixed height
      }}
    >
      <Table highlightOnHover stickyHeader stickyHeaderOffset={0}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ФИО</Table.Th>
            <Table.Th>Пол</Table.Th>
            <Table.Th w={"fit-content"}>Дата рождения</Table.Th>
            <Table.Th>Населенный пункт</Table.Th>
            <Table.Th>Место жительства</Table.Th>
            <Table.Th>Должность</Table.Th>
            <Table.Th>БП</Table.Th>
            <Table.Th>Ишемия</Table.Th>
            <Table.Th>ДЭП</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {virtualizer.getVirtualItems().map((virtualRow, index) => {
            const row = data[virtualRow.index] as Patient;
            return (
              <Table.Tr
                onClick={() => navigate(`${row.id}`)}
                key={row.id}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${
                    virtualRow.start - index * virtualRow.size
                  }px)`,
                  cursor: "pointer",
                }}
              >
                <Table.Td>{row.full_name}</Table.Td>
                <Table.Td>{row.gender}</Table.Td>
                <Table.Td>{parseDate(row.birthday)}</Table.Td>
                <Table.Td>{row.inhabited_locality}</Table.Td>
                <Table.Td>{row.living_place}</Table.Td>
                <Table.Td>{row.job_title}</Table.Td>
                <Table.Td>{row.bp ? "Да" : "Нет"}</Table.Td>
                <Table.Td>{row.ischemia ? "Да" : "Нет"}</Table.Td>
                <Table.Td>{row.dep ? "Да" : "Нет"}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export function parseDate(date: any) {
  return Date.parse(date) ? new Date(date).toLocaleDateString("ru-RU") : date;
}

export default PatientsTable;
