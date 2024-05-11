import { Flex, Paper } from "@mantine/core";
import PatientForm from "../components/PatientForm";
import PatientsTable from "../components/PatientsTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import { notifications } from "@mantine/notifications";

const Patients = () => {
  const patient = useMutation({
    mutationFn: (values) => api.post("patient/create", values),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Пациент успешно создан",
      });
      patients.refetch();
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось создать пациента",
        color: "red",
      });
    },
  });
  const patients = useQuery({
    queryKey: ["patients"],
    queryFn: () =>
      api
        .get("patient/get_all_by_therapist", {
          params: {
            limit: 10000,
          },
        })

        .catch(() => {
          notifications.show({
            title: "Пациенты",
            message: "Не удалось получить пациентов!",
            color: "red",
          });
        }),
  });
  return (
    <Flex gap={"md"}>
      <Paper shadow="xs" p="xl" w={"20%"}>
        <PatientForm handleSubmit={patient.mutate} />
      </Paper>
      <Paper shadow="xs" p="xl">
        <PatientsTable data={patients.data?.data} />
      </Paper>
    </Flex>
  );
};

export default Patients;
