import {
  ActionIcon,
  Button,
  Group,
  PasswordInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  LockClosedIcon,
  MagicWandIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { notifications } from "@mantine/notifications";

const UserForm = () => {
  const users = useQueryClient();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      username: "",
      role: "therapist",
    },
    validate: {
      username: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
      password: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
    },
  });
  const register = useMutation({
    mutationFn: (values: { password: string; username: string }) =>
      api.post("auth/registration", values),
    onSuccess: () => {
      notifications.show({
        title: "Успех",
        message: "Пользователь успешно создан",
      });
      users.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось создать пользователя",
        color: "red",
      });
    },
  });
  return (
    <form onSubmit={form.onSubmit((val) => register.mutate(val))}>
      <TextInput
        label="Логин"
        placeholder="Введите логин"
        key={form.key("username")}
        {...form.getInputProps("username")}
        leftSection={<PersonIcon />}
        rightSection={
          <ActionIcon
            aria-label="generate"
            variant="subtle"
            onClick={() =>
              form.setValues({
                username: "Username" + (Math.random() * 100).toFixed(0),
                password: Math.random().toString(36).slice(2, 10),
              })
            }
          >
            <MagicWandIcon />
          </ActionIcon>
        }
      />
      <PasswordInput
        mt="sm"
        label="Пароль"
        placeholder="Введите пароль"
        key={form.key("password")}
        {...form.getInputProps("password")}
        leftSection={<LockClosedIcon />}
      />
      <Radio.Group
        name="Роль"
        label="Выберите роль"
        description="врач или исследователь"
        key={form.key("role")}
        {...form.getInputProps("role")}
      >
        <Group mt="xs">
          <Radio value="therapist" label="Врач" />
          <Radio value="explorer" label="Исследователь" />
        </Group>
      </Radio.Group>

      <Button type="submit" mt={"sm"}>
        Добавить
      </Button>
    </form>
  );
};

export default UserForm;
