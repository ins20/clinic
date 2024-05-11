import { Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TextInput, Button, PasswordInput } from "@mantine/core";
import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const Login = () => {
  const naviage = useNavigate();
  const logIn = useMutation({
    mutationFn: (values: { password: string; username: string }) =>
      api.post("auth/login", values),
    onSuccess: () => {
      naviage("/dashboard");
      notifications.show({
        title: "Вход",
        message: "Успешная авторизация!",
      });
    },
    onError: () => {
      notifications.show({
        title: "Вход",
        message: "Не удалось авторизоваться!",
        color: "red",
      });
    },
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { password: "", username: "" },

    validate: {
      username: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
      password: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
    },
  });
  return (
    <Center h={"100vh"}>
      <form onSubmit={form.onSubmit((val) => logIn.mutate(val))}>
        <TextInput
          label="Логин"
          placeholder="Введите логин"
          key={form.key("username")}
          {...form.getInputProps("username")}
          leftSection={<PersonIcon />}
        />
        <PasswordInput
          mt="sm"
          label="Пароль"
          placeholder="Введите пароль"
          key={form.key("password")}
          {...form.getInputProps("password")}
          leftSection={<LockClosedIcon />}
        />

        <Button
          type="submit"
          mt="sm"
          w={"100%"}
          loading={logIn.isPending}
          loaderProps={{ type: "oval" }}
        >
          Войти
        </Button>
      </form>
    </Center>
  );
};

export default Login;
