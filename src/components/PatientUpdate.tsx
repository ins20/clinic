import PatientForm from "./PatientForm";
import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { notifications } from "@mantine/notifications";
import { Patient } from "../types";
import dayjs from "dayjs";

function PatientUpdate({ initialValues }: { initialValues: Patient }) {
  const patient = useMutation({
    mutationFn: (values: Patient) =>
      api.patch(
        "patient/update",
        {
          ...values,
          birthday: values.birthday
            ? dayjs(values.birthday).format("YYYY-MM-DD")
            : "",
        },
        {
          params: {
            patient_id: initialValues.id,
          },
        }
      ),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Пациент успешно создан",
      });
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось создать пациента",
        color: "red",
      });
    },
  });
  return (
    <>
      <PatientForm
        handleSubmit={patient.mutate}
        initialValues={initialValues}
      />
    </>
  );
}

export default PatientUpdate;
