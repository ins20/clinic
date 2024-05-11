import { ActionIcon } from "@mantine/core";
import {  TrashIcon } from "@radix-ui/react-icons";
import RecordForm from "./RecordForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import { notifications } from "@mantine/notifications";
import { PatientRecord } from "../types";

function Records({ patient_id }: { patient_id: string }) {
  const recordCreate = useMutation({
    mutationFn: (values: PatientRecord) =>
      api.post("patient_records/create", {
        ...values,
        patient_id,
      }),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Запись успешно создана",
      });
      records.refetch();
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось создать запись",
        color: "red",
      });
    },
  });
  const records = useQuery({
    queryKey: ["patient_records", patient_id],
    queryFn: () =>
      api
        .get<PatientRecord[]>(`patient_records/get_all_by_patient`, {
          params: {
            patient_id,
          },
        })
        .then((res) => {
          // notifications.show({
          //   title: "Записи",
          //   message: "Записи успешно получены!",
          // });
          return res;
        })
        .catch(() => {
          notifications.show({
            title: "Записи",
            message: "Не удалось получить записи!",
            color: "red",
          });
        }),
  });
  const deleteRecord = useMutation({
    mutationFn: (patient_record_id: string) =>
      api.delete("patient_records/delete", {
        params: {
          patient_record_id,
        },
      }),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Запись успешно удалена",
      });
      records.refetch();
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось удалить запись",
        color: "red",
      });
    },
  });
  const recordUpdate = useMutation({
    mutationFn: (values: PatientRecord) =>
      api.patch("patient_records/update_patient_record", values, {
        params: {
          patient_record_id: values.id,
        },
      }),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Запись успешно обновлена",
      });
      records.refetch();
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось обновить запись",
        color: "red",
      });
    },
  });
  return (
    <>
      <RecordForm handleSubmit={recordCreate.mutate} />
      {records.data?.data.map((record) => (
        <>
          <RecordForm
            key={record.id}
            handleSubmit={recordUpdate.mutate}
            initialValues={record}
          />
          <ActionIcon
            color="red"
            onClick={() => deleteRecord.mutate(record.id)}
          >
            <TrashIcon />
          </ActionIcon>
        </>
      ))}
    </>
  );
}

export default Records;
