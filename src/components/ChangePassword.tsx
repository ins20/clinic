import {
  Popover,
  ActionIcon,
  Button,
  PasswordInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { notifications } from "@mantine/notifications";

const ChangePassword = () => {
  const form = useForm({
    mode: "uncontrolled",
    validate: {
      old_password: (value) =>
        value.length < 6 ? "Name must have at least 6 letters" : null,
      new_password: (value) =>
        value.length < 6 ? "Name must have at least 6 letters" : null,
    },
  });
  const changePassword = useMutation({
    mutationFn: (values: { old_password: string; new_password: string }) =>
      api.patch("users/change_password", values),
    onSuccess: () => {
      notifications.show({
        title: "Успех",
        message: "Пароль успешно изменен!",
      });
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось изменить пароль",
        color: "red",
      });
    },
  });
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Tooltip label="Изменить пароль">
          <ActionIcon variant="default" aria-label="change password">
            <LockOpen1Icon />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <form onSubmit={form.onSubmit((val) => changePassword.mutate(val))}>
          <PasswordInput
            mt="sm"
            label="Текущий пароль"
            placeholder="Текущий"
            key={form.key("old_password")}
            {...form.getInputProps("old_password")}
            leftSection={<LockClosedIcon />}
          />
          <PasswordInput
            mt="sm"
            label="Новый пароль"
            placeholder="Новый"
            key={form.key("new_password")}
            {...form.getInputProps("new_password")}
            leftSection={<LockOpen1Icon />}
          />

          <Button type="submit" mt="sm" w={"100%"}>
            Изменить
          </Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ChangePassword;
