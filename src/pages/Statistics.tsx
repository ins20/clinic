import {
  Button,
  Flex,
  Paper,
  Select,
  TextInput,
  Table,
  Popover,
  Group,
  ActionIcon,
  Chip,
  useMantineColorScheme,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
  Cross1Icon,
  MagnifyingGlassIcon,
  MixerVerticalIcon,
  PlusIcon,
  TableIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { FilterConfig, Patient, PatientsResponse } from "../types";
import dayjs from "dayjs";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { exportToExcel } from "react-json-to-excel";
import { parseDate } from "../components/PatientsTable";

const fields = [
  {
    value: "gender",
    label: "Пол",
  },
  {
    value: "birthday",
    label: "Дата рождения",
  },
  {
    value: "inhabited_locality",
    label: "Населенный пункт",
  },
  {
    value: "job_title",
    label: "Должность",
  },
  {
    value: "bp",
    label: "БП",
  },
  {
    value: "ischemia",
    label: "Ишемия",
  },
  {
    value: "dep",
    label: "ДЭП",
  },
];
const stringRules = [
  {
    value: "equals",
    label: "равно",
  },
  {
    value: "not_equals",
    label: "не равно",
  },
  {
    value: "contains",
    label: "содержит",
  },
  {
    value: "not_contains",
    label: "не содержит",
  },
  {
    value: "starts_with",
    label: "начинается с",
  },
  {
    value: "ends_with",
    label: "заканчивается на",
  },
];
const numberRules = [
  {
    value: "equals",
    label: "=",
  },
  {
    value: "not_equals",
    label: "≠",
  },
  {
    value: "greater_than",
    label: ">",
  },
  {
    value: "less_than",
    label: "<",
  },
  {
    value: "greater_than_or_equal",
    label: "≥",
  },
  {
    value: "less_than_or_equal",
    label: "≤",
  },
];
const sortingRules = [
  { field: "gender", order: "" },
  { field: "birthday", order: "" },
  { field: "inhabited_locality", order: "" },
  { field: "job_title", order: "" },
  { field: "bp", order: "" },
  { field: "ischemia", order: "" },
  { field: "dep", order: "" },
];
const booleanRules = [
  {
    value: "equals",
    label: "=",
  },
  {
    value: "not_equals",
    label: "≠",
  },
];

const Statistics = () => {
  const { colorScheme } = useMantineColorScheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const patients = useMutation({
    mutationFn: (values: FilterConfig) =>
      api.post<PatientsResponse>(
        "patient/get_all",
        {
          filters: values.filters,
          sorting_rules: values.sorting_rules,
        },
        {
          params: {
            global_rule: values.global_rule,
            limit: 10000,
          },
        }
      ),
  });
  const form = useForm({
    mode: "controlled",
    initialValues: {
      global_rule: "every",
      filters: [],
      sorting_rules: sortingRules,
    },
    onValuesChange: (values) => {
      setGlobalFilter("");
      if (
        values.filters.every(
          (filter) => filter.value && filter.rule && filter.field
        )
      ) {
        patients.mutate({
          ...values,
          filters: values.filters.map((filter) =>
            filter.field === "birthday"
              ? { ...filter, value: dayjs(filter.value).format("YYYY-MM-DD") }
              : filter
          ),
          sorting_rules: values.sorting_rules.filter((rule) => rule.order),
        });
      }
    },
  });
  const HeadCell = ({
    index,
    children,
  }: {
    index: number;
    children: React.ReactNode;
  }) => {
    const order = form.getInputProps(`sorting_rules.${index}.order`);
    return (
      <Table.Th>
        <Button
          variant="subtle"
          onClick={() =>
            order.onChange(
              order.value === "" ? "asc" : order.value === "asc" ? "desc" : ""
            )
          }
          rightSection={
            order.value === "asc" ? (
              <CaretUpIcon />
            ) : order.value === "desc" ? (
              <CaretDownIcon />
            ) : (
              <CaretSortIcon />
            )
          }
        >
          {children}
        </Button>
      </Table.Th>
    );
  };
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: patients.data?.data.patients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });

  useEffect(() => {
    patients.mutate({});
  }, []);

  return (
    <>
      <Flex justify={"flex-end"} gap={"md"}>
        <TextInput
          placeholder="Поиск"
          leftSection={<MagnifyingGlassIcon />}
          onChange={(e) => {
            const value = e.currentTarget.value;
            if (value) {
              form.reset();
              if (Date.parse(value)) {
                patients.mutate({
                  global_rule: "some",
                  filters: [
                    {
                      field: "birthday",
                      rule: "equals",
                      value: dayjs(value).format("YYYY-MM-DD"),
                    },
                  ],
                });
              } else {
                patients.mutate({
                  global_rule: "some",
                  filters: [
                    {
                      field: "inhabited_locality",
                      rule: "contains",
                      value,
                    },
                    {
                      field: "gender",
                      rule: "contains",
                      value,
                    },
                    {
                      field: "job_title",
                      rule: "contains",
                      value,
                    },
                  ],
                });
              }
            } else {
              patients.mutate({});
            }
            setGlobalFilter(value);
          }}
          value={globalFilter}
        />
        <Popover position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button variant="outline" rightSection={<MixerVerticalIcon />}>
              Фильтры
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Select
              {...form.getInputProps("global_rule")}
              key={form.key("global_rule")}
              placeholder="Тип фильтра"
              data={[
                {
                  value: "every",
                  label: "Весь фильтр",
                },
                {
                  value: "some",
                  label: "Любой фильтр",
                },
              ]}
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              mb={4}
            />

            <Button
              mr={4}
              variant="light"
              leftSection={<PlusIcon />}
              onClick={() =>
                form.insertListItem("filters", {
                  field: "",
                  rule: "equals",
                  value: "",
                })
              }
            >
              Добавить
            </Button>

            <Button
              color="pink"
              variant="light"
              leftSection={<Cross1Icon />}
              onClick={() => form.reset()}
            >
              Сбросить
            </Button>

            {form
              .getValues()
              .filters.map(
                (
                  item: { field: string; value: string; rule: string },
                  index
                ) => (
                  <Group my={"md"} key={index}>
                    <Select
                      placeholder="Поле"
                      data={fields}
                      comboboxProps={{ withinPortal: false }}
                      key={form.key(`filters.${index}.field`)}
                      value={item.field}
                      onChange={(val) => {
                        form.setFieldValue(`filters.${index}.field`, val);
                        form.setFieldValue(`filters.${index}.value`, "");
                      }}
                    />
                    {item.field === "birthday" && (
                      <>
                        <Select
                          placeholder="Правило"
                          data={numberRules}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.rule`)}
                          {...form.getInputProps(`filters.${index}.rule`)}
                        />
                        <DateInput
                          valueFormat="DD MM YYYY"
                          placeholder="Выберите / введите дату"
                          clearable
                          key={form.key(`filters.${index}.value`)}
                          {...form.getInputProps(`filters.${index}.value`)}
                          popoverProps={{ withinPortal: false }}
                        />
                      </>
                    )}
                    {item.field === "job_title" && (
                      <>
                        <Select
                          placeholder="Правило"
                          data={stringRules}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.rule`)}
                          {...form.getInputProps(`filters.${index}.rule`)}
                        />
                        <TextInput
                          placeholder="Введите должность"
                          key={form.key(`filters.${index}.value`)}
                          {...form.getInputProps(`filters.${index}.value`)}
                        />
                      </>
                    )}

                    {item.field === "inhabited_locality" && (
                      <>
                        <Select
                          placeholder="Правило"
                          data={stringRules}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.rule`)}
                          {...form.getInputProps(`filters.${index}.rule`)}
                        />
                        <Select
                          placeholder="Город или район"
                          data={[
                            {
                              value: "Город",
                              label: "Город",
                            },
                            {
                              value: "Район",
                              label: "Район",
                            },
                          ]}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.value`)}
                          {...form.getInputProps(`filters.${index}.value`)}
                        />
                      </>
                    )}
                    {item.field === "gender" && (
                      <>
                        <Select
                          placeholder="Правило"
                          data={stringRules}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.rule`)}
                          {...form.getInputProps(`filters.${index}.rule`)}
                        />
                        <Select
                          placeholder="М или Ж"
                          data={[
                            {
                              value: "м",
                              label: "М",
                            },
                            {
                              value: "ж",
                              label: "Ж",
                            },
                          ]}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.value`)}
                          {...form.getInputProps(`filters.${index}.value`)}
                        />
                      </>
                    )}
                    {(item.field === "bp" ||
                      item.field === "ischemia" ||
                      item.field === "dep") && (
                      <>
                        <Select
                          placeholder="Правило"
                          data={booleanRules}
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.rule`)}
                          {...form.getInputProps(`filters.${index}.rule`)}
                        />
                        <Select
                          placeholder="Да или Нет"
                          comboboxProps={{ withinPortal: false }}
                          key={form.key(`filters.${index}.value`)}
                          {...form.getInputProps(`filters.${index}.value`)}
                          data={[
                            {
                              value: "true",
                              label: "Да",
                            },
                            {
                              value: "false",
                              label: "Нет",
                            },
                          ]}
                        />
                      </>
                    )}

                    <ActionIcon
                      color="pink"
                      variant="light"
                      aria-label={`remove filter ${index}`}
                      onClick={() => form.removeListItem("filters", index)}
                    >
                      <TrashIcon />
                    </ActionIcon>
                  </Group>
                )
              )}
          </Popover.Dropdown>
        </Popover>
        <Button
          variant="light"
          rightSection={<TableIcon />}
          onClick={() =>
            exportToExcel(patients.data?.data.patients, "пациенты")
          }
        >
          EXCEL
        </Button>
      </Flex>

      <Flex gap={"md"} pos={"relative"}>
        <Paper shadow="xs" p="xl" mt={"md"}>
          БП: {patients.data?.data.statistic.bp}
        </Paper>
        <Paper shadow="xs" p="xl" mt={"md"}>
          Ишемия: {patients.data?.data.statistic.ischemia}
        </Paper>
        <Paper shadow="xs" p="xl" mt={"md"}>
          ДЭП: {patients.data?.data.statistic.dep}
        </Paper>
        <Paper shadow="xs" p="xl" mt={"md"}>
          Город: {patients.data?.data.statistic.city}
          <br />
          Район: {patients.data?.data.statistic.district}
        </Paper>
        <Paper shadow="xs" p="xl" mt={"md"}>
          Муж: {patients.data?.data.statistic.male}
          <br />
          Жен: {patients.data?.data.statistic.female}
        </Paper>
        <LoadingOverlay
          visible={patients.isPending}
          zIndex={1000}
          loaderProps={{ type: "dots" }}
        />
      </Flex>
      <Box mt={"md"} pos={"relative"}>
        <div
          ref={parentRef}
          style={{
            overflow: "auto", //our scrollable table container
            position: "relative", //needed for sticky header
            height: "600px", //should be a fixed height
          }}
        >
          <Table stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr>
                {fields.map((field, index) => (
                  <HeadCell index={index} key={field.value}>
                    {field.label}
                  </HeadCell>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = patients.data?.data.patients[
                  virtualRow.index
                ] as Patient;
                return (
                  <Table.Tr
                    key={row.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
                    <Table.Td>{row.gender}</Table.Td>
                    <Table.Td>{parseDate(row.birthday)}</Table.Td>
                    <Table.Td>{row.inhabited_locality}</Table.Td>
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
        <LoadingOverlay visible={patients.isPending} zIndex={1000} />
      </Box>
    </>
  );
};

export default Statistics;
