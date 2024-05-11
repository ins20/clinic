import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";

const DeletePatient = ({ patient_id }: { patient_id: string }) => {
  const openModal = () =>
    modals.openConfirmModal({
      title: "Подтвердите удаление",
      children: (
        <Text size="sm">
          Это действие нельзя будет отменить. Это приведет к безвозвратному
          удалению данных пользователя и его пациентов.
        </Text>
      ),
      labels: { confirm: "Удалить", cancel: "Закрыть" },
      // onCancel: () => console.log("Cancel"),
      onConfirm: () => deletePatient.mutate(patient_id),
    });
  const deletePatient = useMutation({
    mutationKey: ["delete_patient"],
    mutationFn: (patient_id: string) =>
      api
        .delete("patient/delete", {
          params: {
            patient_id,
          },
        })
        .then((res) => res.data),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Пациент успешно удален",
      });
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось удалить пациента",
        color: "red",
      });
    },
  });
  return (
    <Tooltip label="Удалить">
      <ActionIcon aria-label="delete" variant="default" onClick={openModal}>
        <TrashIcon color="red" />
      </ActionIcon>
    </Tooltip>
  );
};

export default DeletePatient;
