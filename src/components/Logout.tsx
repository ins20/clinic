import { ActionIcon, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ExitIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../axios";

const Logout = () => {
  const naviage = useNavigate();
  const logOut = useMutation({
    mutationFn: (values) => api.post("auth/logout", values),
    onSuccess: () => {
      naviage("/");
      notifications.show({
        title: "Выход",
        message: "Вы успешно вышли из системы!",
      });
    },
    onError: () => {
      notifications.show({
        title: "Выход",
        message: "Не удалось выйти из системы!",
        color: "red",
      });
    },
  });
  return (
    <Tooltip label="Выйти">
      <ActionIcon
        aria-label="logout"
        variant="default"
        onClick={() => logOut.mutate()}
        loading={logOut.isPending}
        loaderProps={{ type: "oval" }}
      >
        <ExitIcon />
      </ActionIcon>
    </Tooltip>
  );
};

export default Logout;
