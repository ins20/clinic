import {
  ActionIcon,
  Box,
  Group,
  LoadingOverlay,
  Radio,
  Table,
  Text,
} from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import { User } from "../types";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const UsersTable = () => {
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api
        .get<User[]>("/users/get_all")
        .catch(() => {
          notifications.show({
            title: "Пользователи",
            message: "Не удалось получить пользователей!",
            color: "red",
          });
        }),
  });
  const changeRole = useMutation({
    mutationKey: ["change_role"],
    mutationFn: (values: { user_id: string; new_role: string }) =>
      api
        .patch("users/set_user_role", null, {
          params: values,
        })
        .then((res) => {
          notifications.show({
            title: "Пользователи",
            message: "Роль пользователя успешно изменена!",
          });
          users.refetch();
          return res;
        })
        .catch(() => {
          notifications.show({
            title: "Пользователи",
            message: "Не удалось изменить роль пользователя!",
            color: "red",
          });
        }),
  });
  const deleteUser = useMutation({
    mutationKey: ["delete_user"],
    mutationFn: (user_id: string) =>
      api
        .delete("users/deactivate", {
          params: {
            user_id,
          },
        })
        .then((res) => {
          notifications.show({
            title: "Пользователи",
            message: "Пользователь успешно удален!",
          });
          users.refetch();
          return res;
        })
        .catch(() => {
          notifications.show({
            title: "Пользователи",
            message: "Не удалось удалить пользователя!",
            color: "red",
          });
        }),
  });
  const openModal = (user_id: string) =>
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
      onConfirm: () => deleteUser.mutate(user_id),
    });
  return (
    <Box pos={"relative"}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Имя полььзователя</Table.Th>
            <Table.Th>Роль</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.data?.data.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.username}</Table.Td>
              <Table.Td>
                <Radio.Group
                  value={user.role}
                  onChange={(role) =>
                    changeRole.mutate({ user_id: user.id, new_role: role })
                  }
                >
                  <Group>
                    <Radio value="therapist" label="Врач" />
                    <Radio value="explorer" label="Исследователь" />
                  </Group>
                </Radio.Group>
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  aria-label="delete"
                  variant="default"
                  onClick={() => openModal(user.id)}
                >
                  <TrashIcon color="red" />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <LoadingOverlay
        visible={users.isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    </Box>
  );
};

export default UsersTable;
